/*
  Warnings:

  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `requests` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ein]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[requests] DROP CONSTRAINT [FK_requests_users];

-- AlterTable
ALTER TABLE [dbo].[users] DROP COLUMN [role];
ALTER TABLE [dbo].[users] ADD [children] INT NOT NULL CONSTRAINT [users_children_df] DEFAULT 0,
[ein] INT,
[firstName] NVARCHAR(100),
[guest] BIT NOT NULL CONSTRAINT [users_guest_df] DEFAULT 0,
[lastName] NVARCHAR(100) NOT NULL CONSTRAINT [users_lastName_df] DEFAULT '';

-- DropTable
DROP TABLE [dbo].[requests];

-- CreateTable
CREATE TABLE [dbo].[submissions] (
    [id] INT NOT NULL IDENTITY(1,1),
    [park] NVARCHAR(100) NOT NULL,
    [fullTicket] INT NOT NULL,
    [mealTicket] INT NOT NULL,
    [payrollDeduction] BIT NOT NULL,
    [deductionPeriod] INT NOT NULL,
    [createdAt] DATETIME CONSTRAINT [submissions_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME CONSTRAINT [submissions_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [userId] INT NOT NULL,
    CONSTRAINT [PK_submissions] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_ein_key] UNIQUE NONCLUSTERED ([ein]);

-- AddForeignKey
ALTER TABLE [dbo].[submissions] ADD CONSTRAINT [FK_submissions_users] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
