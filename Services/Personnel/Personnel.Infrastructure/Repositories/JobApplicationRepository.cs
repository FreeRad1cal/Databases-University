using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using MediatR;
using Personnel.Domain.AggregateModel.JobApplicationAggregate;
using Personnel.Infrastructure.Services;
using Personnel.Infrastructure.UnitOfWork;

namespace Personnel.Infrastructure.Repositories
{
    public class JobApplicationRepository : SqlUnitOfWork, IJobApplicationRepository
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;
        private readonly IResumePersisterService _resumePersisterService;

        public JobApplicationRepository(IMediator mediator, IDbConnectionFactory dbConnectionFactory, IResumePersisterService resumePersisterService) 
            : base(mediator, dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
            _resumePersisterService = resumePersisterService;
        }

        public JobApplication Add(JobApplication jobApplication, byte[] resume)
        {
            var sql = $@"INSERT INTO JobApplications (JobPostingId, ApplicantId, Time, ResumeFileName)
                        VALUES (@JobPostingId, @ApplicantId, @Time, @ResumeFileName);
                        SELECT LAST_INSERT_ID();";

            AddOperation(jobApplication, async connection =>
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
            throw new NotImplementedException();
        }

        public async Task<JobApplication> GetAsync(int id)
        {
            var sql = $@"SELECT * FROM JobApplications
                        WHERE JobApplications.Id=@{nameof(id)}";

            using (var conn = await _dbConnectionFactory.GetConnectionAsync())
            {
                return await conn.QueryFirstAsync<JobApplication>(sql, new {id});
            }
        }

        public void Delete(JobApplication jobApplication)
        {
            var sql = $@"DELETE FROM JobApplications
                        WHERE JobApplications.Id=@{nameof(jobApplication.Id)}";
            AddOperation(jobApplication, async connection =>
            {
                await connection.ExecuteAsync(sql, new {jobApplication.Id});
                _resumePersisterService.DeleteResume(jobApplication.ResumeFileName);
            });
        }
    }
}
