namespace ChoreoCreator.API.Contracts.DTOs
{
    /// <summary>
    /// Координаты позиции танцора в построении.
    /// </summary>
    /// <param name="X">Координата по оси X.</param>
    /// <param name="Y">Координата по оси Y.</param>
    public record PositionResponse(
        int X,
        int Y);
}
