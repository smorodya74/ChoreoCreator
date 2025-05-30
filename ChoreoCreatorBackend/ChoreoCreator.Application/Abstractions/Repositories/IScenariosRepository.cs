﻿using ChoreoCreator.Core.Models;

namespace ChoreoCreator.Application.Abstractions.Repositories;

public interface IScenariosRepository
{
    Task<List<Scenario>> GetAllAsync();
    Task<Scenario?> GetByIdAsync(Guid id);
    Task<Scenario?> GetByUserIdAsync(Guid userId);
    Task SaveAsync(Scenario scenario);
    Task<bool> DeleteAsync(Guid id);
}