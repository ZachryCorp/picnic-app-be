/*
  Warnings:

  - The primary key for the `requests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `requests` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `requests` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `requests` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `requests` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - Added the required column `id` to the `requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- Create new tables with correct structure
CREATE TABLE [dbo].[users_new] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(100) NOT NULL,
    [role] NVARCHAR(20) NOT NULL,
    [createdAt] DATETIME CONSTRAINT [users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME CONSTRAINT [users_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK_users_new] PRIMARY KEY CLUSTERED ([id])
);

CREATE TABLE [dbo].[requests_new] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [title] NVARCHAR(100) NOT NULL,
    [description] NVARCHAR(MAX),
    [status] NVARCHAR(20) NOT NULL CONSTRAINT [requests_status_df] DEFAULT 'pending',
    [createdAt] DATETIME CONSTRAINT [requests_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME CONSTRAINT [requests_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK_requests_new] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [FK_requests_users_new] FOREIGN KEY ([userId]) REFERENCES [dbo].[users_new]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Copy data from old tables to new tables
INSERT INTO [dbo].[users_new] ([email], [role], [createdAt], [updatedAt])
SELECT [email], [role], [created_at], [updated_at]
FROM [dbo].[users];

INSERT INTO [dbo].[requests_new] ([userId], [title], [description], [status], [createdAt], [updatedAt])
SELECT [user_id], [title], [description], [status], [created_at], [updated_at]
FROM [dbo].[requests];

-- Drop old tables
DROP TABLE [dbo].[requests];
DROP TABLE [dbo].[users];

-- Rename new tables to original names
EXEC sp_rename 'users_new', 'users';
EXEC sp_rename 'PK_users_new', 'PK_users';
EXEC sp_rename 'requests_new', 'requests';
EXEC sp_rename 'PK_requests_new', 'PK_requests';
EXEC sp_rename 'FK_requests_users_new', 'FK_requests_users';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
