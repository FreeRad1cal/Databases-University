using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Personnel.Infrastructure.Services
{
    public interface IResumePersisterService
    {
        Task<string> SaveResumeAsync(byte[] resume, string fileName);

        Task<byte[]> GetResumeAsync(string fileName);

        void DeleteResume(string fileName);

        string CreateFilename();
    }
}
