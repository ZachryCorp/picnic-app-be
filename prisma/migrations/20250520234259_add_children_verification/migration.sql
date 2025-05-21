BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[submissions] ADD CONSTRAINT [submissions_payrollDeduction_df] DEFAULT 0 FOR [payrollDeduction];
ALTER TABLE [dbo].[submissions] ADD [childrenVerification] BIT NOT NULL CONSTRAINT [submissions_childrenVerification_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
