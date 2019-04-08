using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Personnel.Api.Application.Queries;
using Personnel.Api.Models;

namespace Personnel.Api.Infrastructure.Binders
{
    public class PaginationBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
            {
                throw new ArgumentNullException(nameof(bindingContext));
            }

            var limitValueResult = bindingContext.ValueProvider.GetValue(nameof(Pagination.Limit));
            var offsetValueResult = bindingContext.ValueProvider.GetValue(nameof(Pagination.Offset));

            try
            {
                var pagination = new Pagination()
                {
                    Limit = int.Parse(limitValueResult.FirstValue),
                    Offset = int.Parse(offsetValueResult.FirstValue)
                };
                bindingContext.Result = ModelBindingResult.Success(pagination);
            }
            catch
            {
                bindingContext.Result = ModelBindingResult.Success(Pagination.Default);
            }

            return Task.CompletedTask;
        }
    }
}
