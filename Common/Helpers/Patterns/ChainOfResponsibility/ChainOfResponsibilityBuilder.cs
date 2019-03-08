using System.Collections.Generic;
using System.Linq;

namespace Helpers.Patterns.ChainOfResponsibility
{
    public class ChainOfResponsibilityBuilder<TRequest, TReturn>
    {
        private List<ChainOfResponsibilityHandler<TRequest, TReturn>> Handlers { get; } =
            new List<ChainOfResponsibilityHandler<TRequest, TReturn>>();
        private ChainOfResponsibilityHandler<TRequest, TReturn> DefaultHandler { get; set; }

        public ChainOfResponsibilityBuilder<TRequest, TReturn> AddHandler(
            ChainOfResponsibilityHandler<TRequest, TReturn> handler)
        {
            Handlers.Add(handler);
            return this;
        }

        public ChainOfResponsibilityBuilder<TRequest, TReturn> AddDefaultHandler(TReturn defaultValue)
        {
            DefaultHandler = new NullChainOfResponsibilityHandler<TRequest, TReturn>(defaultValue);
            return this;
        }

        public ChainOfResponsibilityHandler<TRequest, TReturn> Build()
        {
            if (DefaultHandler == null)
            {
                DefaultHandler = new NullChainOfResponsibilityHandler<TRequest, TReturn>();
            }

            var (head, tail) = (Handlers.FirstOrDefault(), Handlers.FirstOrDefault());
            foreach (var handler in Handlers.Skip(1).Append(DefaultHandler))
            {
                if (tail != null)
                {
                    tail.NextHandler = handler;
                }
                else
                {
                    head = handler;
                }

                tail = handler;
            }

            return head;
        }
    }
}
