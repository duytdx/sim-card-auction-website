using BidX.BusinessLogic.Interfaces;
using Microsoft.Extensions.Configuration;
using sib_api_v3_sdk.Api;
using sib_api_v3_sdk.Client;
using sib_api_v3_sdk.Model;
using Task = System.Threading.Tasks.Task;
namespace BidX.BusinessLogic.Services;

public class BrevoEmailService : IEmailService
{
    private readonly IConfiguration configuration;
    private readonly TransactionalEmailsApi apiInstance;
    public BrevoEmailService(IConfiguration configuration)
    {
        Configuration.Default.ApiKey["api-key"] = Environment.GetEnvironmentVariable("BREVO_EMAIL_SERVICE_API_KEY");
        apiInstance = new TransactionalEmailsApi();
        this.configuration = configuration;
    }

    public async Task SendConfirmationEmail(string userEmail, string confirmationLink)
    {
        await SendTemplatedEmail(
            userEmail,
            configuration[$"BrevoEmailApi:ConfirmationEmailTemplateId"]!,
            new { ConfirmationLink = confirmationLink });
    }

    public async Task SendPasswordResetEmail(string userEmail, string passwordResetPageLink)
    {
        await SendTemplatedEmail(
            userEmail,
            configuration[$"BrevoEmailApi:PasswordResetEmailTemplateId"]!,
            new { PasswordResetPageLink = passwordResetPageLink });
    }


    private async Task SendTemplatedEmail(string userEmail, string emailTemplateId, object parameters)
    {
        var templateId = long.Parse(emailTemplateId);

        var to = new List<SendSmtpEmailTo> { new(userEmail) };

        var sendSmtpEmail = new SendSmtpEmail(templateId: templateId, to: to, _params: parameters);

        await apiInstance.SendTransacEmailAsync(sendSmtpEmail);
    }

}