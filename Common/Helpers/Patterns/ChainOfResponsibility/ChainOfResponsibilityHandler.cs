namespace Helpers.Patterns.ChainOfResponsibility
{
    public abstract class ChainOfResponsibilityHandler<TRequest, TReturn>
    {
        public ChainOfResponsibilityHandler<TRequest, TReturn> NextHandler { get; set; }

        public abstract TReturn Handle(TRequest request);
    }
}
