namespace BidX.BusinessLogic.Interfaces;

public interface IEmailService
{
    Task SendPasswordResetEmail(string userEmail, string passowrdResetPageLink);
}
