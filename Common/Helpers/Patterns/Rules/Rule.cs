using System.Threading;
using System.Threading.Tasks;

namespace Helpers.Patterns.Rules
{
    public abstract class Rule<TInput>
    {
        protected Rule<TInput> Next { get; private set; }

        public abstract Task ApplyAsync(TInput input, CancellationToken ct = default);

        public Rule<TInput> AddRule(Rule<TInput> rule)
        {
            switch (Next)
            {
                case null:
                    Next = rule;
                    break;
                case NoopRule<TInput> _:
                    rule.Next = Next;
                    Next = rule;
                    break;
                default:
                    Next.AddRule(rule);
                    break;
            }
            return this;
        }
    }

    public abstract class Rule<TInput, TOutput>
    {
        protected Rule<TInput, TOutput> Next { get; private set; }

        public abstract Task<TOutput> ApplyAsync(TInput input, CancellationToken ct = default);

        public Rule<TInput, TOutput> AddRule(Rule<TInput, TOutput> rule)
        {
            switch (Next)
            {
                case null:
                    Next = rule;
                    break;
                case NoopRule<TInput, TOutput> _:
                    rule.Next = Next;
                    Next = rule;
                    break;
                default:
                    Next.AddRule(rule);
                    break;
            }
            return this;
        }
    }
}
