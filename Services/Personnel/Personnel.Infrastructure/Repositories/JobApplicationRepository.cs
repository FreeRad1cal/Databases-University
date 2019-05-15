using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using MediatR;
using Personnel.Domain.AggregateModel.JobApplicationAggregate;
using Personnel.Domain.Common;
using Personnel.Infrastructure.Services;
using Personnel.Infrastructure.UnitOfWork;

namespace Personnel.Infrastructure.Repositories
{
    public class JobApplicationRepository : IJobApplicationRepository
    {
        public IUnitOfWork UnitOfWork { get; }

        private readonly IDbConnectionFactory _dbConnectionFactory;
        private readonly IResumePersisterService _resumePersisterService;
        private readonly IMapper _mapper;

        public JobApplicationRepository(
            IUnitOfWork unitOfWork, 
            IDbConnectionFactory dbConnectionFactory, 
            IResumePersisterService resumePersisterService,
            IMapper mapper)
        {
            UnitOfWork = unitOfWork;
            _dbConnectionFactory = dbConnectionFactory;
            _resumePersisterService = resumePersisterService;
            _mapper = mapper;
        }

        public JobApplication Add(JobApplication jobApplication, byte[] resume)
        {
            var sql = $@"INSERT INTO JobApplications (JobPostingId, ApplicantId, Time, ResumeFileName)
                        VALUES (@JobPostingId, @ApplicantId, @Time, @ResumeFileName);
                        SELECT LAST_INSERT_ID();";

            UnitOfWork.AddOperation(jobApplication, async connection =>
            {
                var resumeFilename = _resumePersisterService.CreateFilename();
                var id = await connection.QueryFirstAsync<int>(sql, new
                {
                    jobApplication.JobPostingId,
                    jobApplication.ApplicantId,
                    jobApplication.Time,
                    ResumeFileName = resumeFilename
                });
                jobApplication.Id = id;
                await _resumePersisterService.SaveResumeAsync(resume, resumeFilename);
            });

            return jobApplication;
        }

        public void Update(JobApplication jobApplication)
        {
            InsertJobApplicationDecision(jobApplication.Id, jobApplication.Decision);
        }

        public async Task<JobApplication> GetAsync(int id)
        {
            var sql = $@"SELECT * FROM JobApplications
                        LEFT JOIN JobApplicationDecisions ON JobApplicationDecisions.JobApplicationId = JobApplications.Id
                        WHERE JobApplications.Id = @{nameof(id)}";

            using (var conn = await _dbConnectionFactory.GetConnectionAsync())
            {
                var resultSet = await conn.QueryAsync<dynamic, JobApplicationDecision, JobApplication>(sql,
                    (app, dec) =>
                    {
                        if (dec.Decision != null)
                        {
                            app.Decision = dec;
                        } 
                        return _mapper.Map<JobApplication>(app);
                    },
                    new {id}, splitOn: "JobApplicationId");
                return resultSet.FirstOrDefault();
            }
        }

        public void Delete(JobApplication jobApplication)
        {
            var sql = $@"DELETE FROM JobApplications
                        WHERE JobApplications.Id=@{nameof(jobApplication.Id)}";
            UnitOfWork.AddOperation(jobApplication, async connection =>
            {
                await connection.ExecuteAsync(sql, new {jobApplication.Id});
                _resumePersisterService.DeleteResume(jobApplication.ResumeFileName);
            });
        }

        private void InsertJobApplicationDecision(int jobApplicationId, JobApplicationDecision decision)
        {
            var sql = $@"INSERT INTO JobApplicationDecisions (JobApplicationId, Decision, DeciderId, DecisionDate)
                        VALUES (@{nameof(jobApplicationId)}, @{nameof(decision.Decision)}, @{nameof(decision.DeciderId)}, @{nameof(decision.DecisionDate)});";
            UnitOfWork.AddOperation(decision, async conn =>
            {
                await conn.ExecuteAsync(sql, new
                {
                    jobApplicationId,
                    decision.Decision,
                    decision.DeciderId,
                    decision.DecisionDate
                });
            });
        }
    }
}
