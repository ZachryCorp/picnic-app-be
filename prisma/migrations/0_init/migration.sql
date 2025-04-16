BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[requests] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [title] NVARCHAR(100) NOT NULL,
    [description] NVARCHAR(max),
    [status] NVARCHAR(20) NOT NULL CONSTRAINT [DEFAULT_requests_status] DEFAULT 'pending',
    [created_at] DATETIME CONSTRAINT [DEFAULT_requests_created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME CONSTRAINT [DEFAULT_requests_updated_at] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK_requests] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[users] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(100) NOT NULL,
    [role] NVARCHAR(20) NOT NULL,
    [created_at] DATETIME CONSTRAINT [DEFAULT_users_created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME CONSTRAINT [DEFAULT_users_updated_at] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK_users] PRIMARY KEY CLUSTERED ([Id])
);

-- AddForeignKey
ALTER TABLE [dbo].[requests] ADD CONSTRAINT [FK_requests_users] FOREIGN KEY ([Id]) REFERENCES [dbo].[users]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

