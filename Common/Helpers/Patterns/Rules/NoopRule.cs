using System.Threading;
using System.Threading.Tasks;

namespace Helpers.Patterns.Rules
{
    internal class NoopRule<TInput> : Rule<TInput>
    {
        public override async Task ApplyAsync(TInput input, CancellationToken ct = default)
        {
            await Task.CompletedTask;
        }
    }

    internal class NoopRule<TInput, TOutput> : Rule<TInput, TOutput>
    {
        public override async Task<TOutput> ApplyAsync(TInput input, CancellationToken ct = default)
        {
            return await Task.FromResult(default(TOutput));
        }
    }
}
