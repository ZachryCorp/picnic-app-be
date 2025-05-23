/*
  Warnings:

  - You are about to drop the column `deductionPeriod` on the `submissions` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[submissions] DROP COLUMN [deductionPeriod];
ALTER TABLE [dbo].[submissions] ADD [additionalFullTicket] INT NOT NULL CONSTRAINT [submissions_additionalFullTicket_df] DEFAULT 0,
[additionalMealTicket] INT NOT NULL CONSTRAINT [submissions_additionalMealTicket_df] DEFAULT 0,
[deductionPeriods] INT NOT NULL CONSTRAINT [submissions_deductionPeriods_df] DEFAULT 0,
[guest] BIT NOT NULL CONSTRAINT [submissions_guest_df] DEFAULT 0,
[notes] NVARCHAR(1000) NOT NULL CONSTRAINT [submissions_notes_df] DEFAULT '',
[pendingDependentChildren] INT NOT NULL CONSTRAINT [submissions_pendingDependentChildren_df] DEFAULT 0,
[ticketsToBeDistributed] INT NOT NULL CONSTRAINT [submissions_ticketsToBeDistributed_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
