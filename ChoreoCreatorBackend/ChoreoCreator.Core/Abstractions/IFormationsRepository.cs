using ChoreoCreator.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChoreoCreator.Core.Abstractions
{
    public interface IFormationsRepository
    {
        Task<List<Formation>> GetByScenarioId(Guid scenarioId);
        Task<Guid> Create(Formation formation);
        Task<Guid> Delete(Guid id);
    }
}
