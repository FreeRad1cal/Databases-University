using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Personnel.Infrastructure.Services
{
    public class ResumePersisterService : IResumePersisterService
    {
        private readonly ILogger<ResumePersisterService> _logger;
        private readonly string ResumeDirectoryName = "resumes";

        public ResumePersisterService(ILogger<ResumePersisterService> logger)
        {
            _logger = logger;
        }

        public async Task<string> SaveResumeAsync(byte[] resume, string fileName)
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), ResumeDirectoryName, fileName);

            using (var writeStream = new FileStream(path, FileMode.CreateNew))
            using (var readStream = new MemoryStream(resume))
            {
                await readStream.CopyToAsync(writeStream);
            }

            _logger.LogInformation($"Saved a new resume to {path}");

            return fileName;
        }

        public async Task<byte[]> GetResumeAsync(string fileName)
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), ResumeDirectoryName, fileName);
            using (var readStream = new FileStream(path, FileMode.Open))
            using (var writeStream = new MemoryStream())
            {
                await readStream.CopyToAsync(writeStream);
                return writeStream.ToArray();
            }
        }

        public void DeleteResume(string fileName)
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), ResumeDirectoryName, fileName);
            File.Delete(path);

            _logger.LogInformation($"Deleted a resume at {path}");
        }

        public string CreateFilename()
        {
            return $"{Guid.NewGuid().ToString()}.pdf";
        }
    }
}
