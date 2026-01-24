namespace ChoreoCreator.API.Contracts.DTOs
{
    /// <summary>
    /// Координаты позиции танцора в запросе.
    /// </summary>
    /// <param name="X">Координата по оси X.</param>
    /// <param name="Y">Координата по оси Y.</param>
    public record PositionRequest(
        int X,
        int Y);
}
