CREATE SCHEMA [sword]
GO
/****** Object:  Table [sword].[Connections]    Script Date: 10/21/2014 9:48:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [sword].[Connections](
	[ConnectionID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NULL,
	[ConnectionString] [varchar](255) NULL,
 CONSTRAINT [PK_Connections] PRIMARY KEY CLUSTERED 
(
	[ConnectionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [sword].[ConnectionStrings]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [sword].[ConnectionStrings](
	[ConnectionStringID] [int] IDENTITY(1,1) NOT NULL,
	[MachineName] [varchar](50) NULL,
	[Value] [varchar](255) NULL,
	[ProjectID] [int] NOT NULL,
	[Target] [varchar](255) NULL,
	[IsDefault] [bit] NULL,
	[IsProduction] [bit] NULL,
 CONSTRAINT [PK_ConnectionStrings] PRIMARY KEY CLUSTERED 
(
	[ConnectionStringID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [sword].[Enums]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [sword].[Enums](
	[EnumID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NULL,
	[HasFlags] [bit] NULL,
	[ConnectionID] [int] NULL,
	[TableName] [varchar](50) NULL,
	[ValueColumn] [varchar](50) NULL,
	[DisplayColumn] [varchar](50) NULL,
	[IncludeNoneValue] [bit] NULL,
	[FilterColumn] [varchar](50) NULL,
	[FilterValue] [varchar](50) NULL,
	[ProjectID] [int] NULL,
 CONSTRAINT [PK_Enums] PRIMARY KEY CLUSTERED 
(
	[EnumID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [sword].[Fields]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [sword].[Fields](
	[FieldID] [int] IDENTITY(1,1) NOT NULL,
	[ObjectID] [int] NOT NULL,
	[TableName] [varchar](50) NULL,
	[Include] [bit] NULL,
	[JsonSerializable] [bit] NULL,
	[XmlSerializable] [bit] NULL,
	[SqlDbType] [int] NULL,
	[UDT] [varchar](50) NULL,
	[GetMethod] [varchar](1000) NULL,
	[SetMethod] [varchar](1000) NULL,
	[IsReadOnly] [bit] NULL,
	[Aliases] [varchar](1000) NULL,
	[PropertyName] [varchar](50) NULL,
	[UseChangeEvent] [bit] NULL,
	[DefaultValue] [varchar](100) NULL,
	[IsEnum] [bit] NULL,
	[IncludeInSetValue] [bit] NULL,
 CONSTRAINT [PK_Fields] PRIMARY KEY CLUSTERED 
(
	[FieldID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [sword].[Objects]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [sword].[Objects](
	[ObjectID] [int] IDENTITY(1,1) NOT NULL,
	[ClassName] [varchar](50) NULL,
	[TableName] [varchar](255) NULL,
	[ConnectionID] [int] NULL,
	[ProjectID] [int] NOT NULL,
	[Target] [varchar](255) NULL,
	[UseObjectState] [bit] NULL,
	[UseChangeEvent] [bit] NULL,
	[UserCode] [varchar](max) NULL,
	[Namespace] [varchar](255) NULL,
	[IsPartial] [bit] NULL,
	[PK] [varchar](100) NULL,
	[DefaultConnectionString] [varchar](255) NULL,
	[AllowDeletes] [bit] NULL,
	[AllowInserts] [bit] NULL,
	[ScopeID] [varchar](50) NULL,
 CONSTRAINT [PK_Objects] PRIMARY KEY CLUSTERED 
(
	[ObjectID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [sword].[Parameters]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [sword].[Parameters](
	[ParameterID] [int] IDENTITY(1,1) NOT NULL,
	[ProcedureID] [int] NULL,
	[Scale] [tinyint] NULL,
	[SqlDbType] [int] NULL,
	[Precision] [tinyint] NULL,
	[Size] [int] NULL,
	[Direction] [int] NULL,
	[DefaultValue] [varchar](50) NULL,
	[Name] [varchar](50) NULL,
	[SourceColumn] [varchar](100) NULL,
 CONSTRAINT [PK_Parameters] PRIMARY KEY CLUSTERED 
(
	[ParameterID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [sword].[Procedures]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [sword].[Procedures](
	[ProcedureID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NULL,
	[ObjectID] [int] NULL,
	[CommandType] [int] NULL,
	[ConnectionID] [int] NULL,
	[StaticConnectionString] [varchar](50) NULL,
	[CommandText] [varchar](2000) NULL,
	[ProcedureType] [int] NULL,
 CONSTRAINT [PK_Procedures] PRIMARY KEY CLUSTERED 
(
	[ProcedureID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [sword].[ProjectProcedures]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [sword].[ProjectProcedures](
	[ProjectProcedureID] [int] IDENTITY(1,1) NOT NULL,
	[ProjectID] [int] NULL,
	[CommandText] [varchar](100) NULL,
	[Alias] [varchar](100) NULL,
	[Wrapper] [varchar](100) NULL,
 CONSTRAINT [PK_ProjectProcedures] PRIMARY KEY CLUSTERED 
(
	[ProjectProcedureID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [sword].[Projects]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [sword].[Projects](
	[ProjectID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](100) NULL,
	[BuildPath] [varchar](255) NULL,
	[PublishPath] [varchar](255) NULL,
	[Namespace] [varchar](255) NULL,
	[DefaultConnectionString] [varchar](255) NULL,
 CONSTRAINT [PK_Projects] PRIMARY KEY CLUSTERED 
(
	[ProjectID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
ALTER TABLE [sword].[ConnectionStrings] ADD  CONSTRAINT [DF_ConnectionStrings_IsDefault]  DEFAULT ((0)) FOR [IsDefault]
GO
ALTER TABLE [sword].[ConnectionStrings] ADD  CONSTRAINT [DF_ConnectionStrings_IsProduction]  DEFAULT ((0)) FOR [IsProduction]
GO
ALTER TABLE [sword].[Enums] ADD  CONSTRAINT [DF_Enums_HasFlags]  DEFAULT ((0)) FOR [HasFlags]
GO
ALTER TABLE [sword].[Enums] ADD  CONSTRAINT [DF_Enums_IncludeNoneValue]  DEFAULT ((0)) FOR [IncludeNoneValue]
GO
ALTER TABLE [sword].[Fields] ADD  CONSTRAINT [DF_Fields_Include]  DEFAULT ((1)) FOR [Include]
GO
ALTER TABLE [sword].[Fields] ADD  CONSTRAINT [DF_Fields_JsonSerializable]  DEFAULT ((1)) FOR [JsonSerializable]
GO
ALTER TABLE [sword].[Fields] ADD  CONSTRAINT [DF_Fields_XmlSerializable]  DEFAULT ((1)) FOR [XmlSerializable]
GO
ALTER TABLE [sword].[Fields] ADD  CONSTRAINT [DF_Fields_IsReadOnly]  DEFAULT ((0)) FOR [IsReadOnly]
GO
ALTER TABLE [sword].[Fields] ADD  CONSTRAINT [DF_Fields_UseChangeEvent]  DEFAULT ((0)) FOR [UseChangeEvent]
GO
ALTER TABLE [sword].[Fields] ADD  CONSTRAINT [DF_Fields_IncludeInSetValue]  DEFAULT ((1)) FOR [IncludeInSetValue]
GO
ALTER TABLE [sword].[Objects] ADD  CONSTRAINT [DF_Objects_UseObjectState]  DEFAULT ((0)) FOR [UseObjectState]
GO
ALTER TABLE [sword].[Objects] ADD  CONSTRAINT [DF_Objects_UseChangeEvent]  DEFAULT ((0)) FOR [UseChangeEvent]
GO
ALTER TABLE [sword].[ConnectionStrings]  WITH CHECK ADD  CONSTRAINT [FK_ConnectionStrings_Projects] FOREIGN KEY([ProjectID])
REFERENCES [sword].[Projects] ([ProjectID])
GO
ALTER TABLE [sword].[ConnectionStrings] CHECK CONSTRAINT [FK_ConnectionStrings_Projects]
GO
ALTER TABLE [sword].[Enums]  WITH CHECK ADD  CONSTRAINT [FK_Enums_Connections] FOREIGN KEY([ConnectionID])
REFERENCES [sword].[Connections] ([ConnectionID])
GO
ALTER TABLE [sword].[Enums] CHECK CONSTRAINT [FK_Enums_Connections]
GO
ALTER TABLE [sword].[Enums]  WITH CHECK ADD  CONSTRAINT [FK_Enums_Projects] FOREIGN KEY([ProjectID])
REFERENCES [sword].[Projects] ([ProjectID])
GO
ALTER TABLE [sword].[Enums] CHECK CONSTRAINT [FK_Enums_Projects]
GO
ALTER TABLE [sword].[Fields]  WITH CHECK ADD  CONSTRAINT [FK_Fields_Objects] FOREIGN KEY([ObjectID])
REFERENCES [sword].[Objects] ([ObjectID])
ON DELETE CASCADE
GO
ALTER TABLE [sword].[Fields] CHECK CONSTRAINT [FK_Fields_Objects]
GO
ALTER TABLE [sword].[Objects]  WITH NOCHECK ADD  CONSTRAINT [FK_Objects_Connections] FOREIGN KEY([ConnectionID])
REFERENCES [sword].[Connections] ([ConnectionID])
GO
ALTER TABLE [sword].[Objects] NOCHECK CONSTRAINT [FK_Objects_Connections]
GO
ALTER TABLE [sword].[Objects]  WITH CHECK ADD  CONSTRAINT [FK_Objects_Projects] FOREIGN KEY([ProjectID])
REFERENCES [sword].[Projects] ([ProjectID])
GO
ALTER TABLE [sword].[Objects] CHECK CONSTRAINT [FK_Objects_Projects]
GO
ALTER TABLE [sword].[Parameters]  WITH CHECK ADD  CONSTRAINT [FK_Parameters_Procedures] FOREIGN KEY([ProcedureID])
REFERENCES [sword].[Procedures] ([ProcedureID])
ON DELETE CASCADE
GO
ALTER TABLE [sword].[Parameters] CHECK CONSTRAINT [FK_Parameters_Procedures]
GO
ALTER TABLE [sword].[Procedures]  WITH CHECK ADD  CONSTRAINT [FK_Procedures_Connections] FOREIGN KEY([ConnectionID])
REFERENCES [sword].[Connections] ([ConnectionID])
GO
ALTER TABLE [sword].[Procedures] CHECK CONSTRAINT [FK_Procedures_Connections]
GO
ALTER TABLE [sword].[Procedures]  WITH CHECK ADD  CONSTRAINT [FK_Procedures_Objects] FOREIGN KEY([ObjectID])
REFERENCES [sword].[Objects] ([ObjectID])
ON DELETE CASCADE
GO
ALTER TABLE [sword].[Procedures] CHECK CONSTRAINT [FK_Procedures_Objects]
GO
/****** Object:  StoredProcedure [sword].[Connection_Get]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Connection_Get]
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT 
		c.ConnectionID,
		c.Name,
		c.ConnectionString
	FROM 
		sword.Connections c
	ORDER BY
		c.Name;
	
	
END


GO
/****** Object:  StoredProcedure [sword].[Connection_Insert]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Connection_Insert]	
	@ConnectionID int output,
	@Name varchar(50),
	@ConnectionString varchar(255)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    -- Insert statements for procedure here
	INSERT INTO sword.[Connections]
           (Name
           ,ConnectionString)
     VALUES
           (@Name
           ,@ConnectionString);
           
	SET @ConnectionID = SCOPE_IDENTITY();
	
	
END


GO
/****** Object:  StoredProcedure [sword].[Connection_Update]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Connection_Update]	
	@ConnectionID int,
	@Name varchar(50),
	@ConnectionString varchar(255)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    -- Insert statements for procedure here
	UPDATE sword.[Connections]
	SET [Name] = @Name
      ,[ConnectionString] = @ConnectionString
	WHERE 
		ConnectionID = @ConnectionID
	
	
END


GO
/****** Object:  StoredProcedure [sword].[ConnectionString_Delete]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[ConnectionString_Delete]
	@ConnectionStringID int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DELETE FROM sword.ConnectionStrings
	WHERE
		ConnectionStringID = @ConnectionStringID
	
	
END


GO
/****** Object:  StoredProcedure [sword].[ConnectionString_Get]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[ConnectionString_Get]	
	@ProjectID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SELECT 
		[ConnectionStringID]
		,[MachineName]
		,[Value]
		,[ProjectID]
		,[Target]
		,IsDefault
		,IsProduction
	FROM 
		sword.ConnectionStrings
	WHERE
		ProjectID = @ProjectID
	
	
END


GO
/****** Object:  StoredProcedure [sword].[ConnectionString_Insert]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[ConnectionString_Insert]		
	@ConnectionStringID int output,
	@MachineName varchar(50),
	@Value varchar(255),
	@ProjectID int,
	@Target varchar(255),
	@IsDefault bit,
	@IsProduction bit
	

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	INSERT INTO sword.ConnectionStrings
		(MachineName
		,Value
		,ProjectID
		,[Target]
		,IsDefault
		,IsProduction)
    VALUES
        (@MachineName
		,@Value
		,@ProjectID
		,@Target
		,@IsDefault
		,@IsProduction);
	
	SET @ConnectionStringID = SCOPE_IDENTITY();
	
	
END


GO
/****** Object:  StoredProcedure [sword].[ConnectionString_Update]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[ConnectionString_Update]
	@ConnectionStringID int,
	@MachineName varchar(50),
	@Value varchar(255),
	@ProjectID int,
	@Target varchar(255),
	@IsDefault bit,
	@IsProduction bit

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	UPDATE sword.ConnectionStrings
	SET [MachineName] = @MachineName
      ,[Value] = @Value
      ,IsDefault = @IsDefault    
      ,IsProduction = @IsProduction
	WHERE 
		ConnectionStringID = @ConnectionStringID
	
	
END


GO
/****** Object:  StoredProcedure [sword].[Enum_Delete]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Enum_Delete]

	@EnumID int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	DELETE FROM sword.Enums
	WHERE
		EnumID = @EnumID;
	
	
END


GO
/****** Object:  StoredProcedure [sword].[Enum_Get]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Enum_Get]

	@ProjectID int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SELECT 
		EnumID
		,Name
		,HasFlags
		,ConnectionID
		,TableName
		,ValueColumn
		,DisplayColumn
		,IncludeNoneValue
		,FilterColumn
		,FilterValue
		,ProjectID
	FROM sword.Enums
	WHERE
		ProjectID = @ProjectID;
	
	
END


GO
/****** Object:  StoredProcedure [sword].[Enum_Insert]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Enum_Insert]

	@EnumID int output,
	@Name varchar(50),
	@HasFlags bit,
	@ConnectionID int,
	@TableName varchar(50),
	@ValueColumn varchar(50),
	@DisplayColumn varchar(50),
	@IncludeNoneValue bit,
	@FilterColumn varchar(50),
	@FilterValue varchar(50),
	@ProjectID int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	INSERT INTO sword.Enums
		(Name
		,HasFlags
		,ConnectionID
		,TableName
		,ValueColumn
		,DisplayColumn
		,IncludeNoneValue
		,FilterColumn
		,FilterValue
		,ProjectID)
	VALUES
		(@Name
		,@HasFlags
		,@ConnectionID
		,@TableName
		,@ValueColumn
		,@DisplayColumn
		,@IncludeNoneValue
		,@FilterColumn
		,@FilterValue
		,@ProjectID);
	SET @EnumID = SCOPE_IDENTITY();
	
END


GO
/****** Object:  StoredProcedure [sword].[Enum_Update]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Enum_Update]

	@EnumID int,
	@Name varchar(50),
	@HasFlags bit,
	@ConnectionID int,
	@TableName varchar(50),
	@ValueColumn varchar(50),
	@DisplayColumn varchar(50),
	@IncludeNoneValue bit,
	@FilterColumn varchar(50),
	@FilterValue varchar(50),
	@ProjectID int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	UPDATE sword.Enums
	SET 
		Name = @Name
		,HasFlags = @HasFlags		
		,TableName = @TableName
		,ValueColumn = @ValueColumn
		,DisplayColumn = @DisplayColumn
		,IncludeNoneValue = @IncludeNoneValue
		,FilterColumn = @FilterColumn
		,FilterValue = @FilterValue
	WHERE 
		EnumID = @EnumID;
	
END


GO
/****** Object:  StoredProcedure [sword].[Field_Delete]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Field_Delete]

	@FieldID int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DELETE FROM sword.Fields
	WHERE
		FieldID = @FieldID;
	
END


GO
/****** Object:  StoredProcedure [sword].[Field_Get]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Field_Get]

	@ObjectID int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SELECT FieldID
      ,ObjectID
      ,TableName
      ,Include
      ,JsonSerializable
      ,XmlSerializable
      ,SqlDbType
      ,UDT
      ,GetMethod
      ,SetMethod
      ,IsReadOnly
      ,Aliases
      ,PropertyName
      ,UseChangeEvent
      ,DefaultValue
      ,IsEnum
      ,IncludeInSetValue
	FROM sword.Fields
	WHERE
		ObjectID = @ObjectID;
	
END


GO
/****** Object:  StoredProcedure [sword].[Field_Insert]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Field_Insert]

	@FieldID int output,
	@ObjectID int,
	@TableName varchar(50),
	@Include bit,
	@JsonSerializable bit,
	@XmlSerializable bit,
	@SqlDbType int,
	@UDT varchar(50),
	@GetMethod varchar(1000),
	@SetMethod varchar(1000),
	@IsReadOnly bit,
	@Aliases varchar(1000),
	@PropertyName varchar(50),
	@UseChangeEvent bit,
	@DefaultValue varchar(100),
	@IsEnum bit,
	@IncludeInSetValue bit

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	INSERT INTO sword.Fields
		(ObjectID
		,TableName
		,[Include]
		,JsonSerializable
		,XmlSerializable
		,SqlDbType
		,UDT
		,GetMethod
		,SetMethod
		,IsReadOnly
		,Aliases
		,PropertyName
		,UseChangeEvent
		,DefaultValue
		,IsEnum
		,IncludeInSetValue)
     VALUES
		(@ObjectID
		,@TableName
		,@Include
		,@JsonSerializable
		,@XmlSerializable
		,@SqlDbType
		,@UDT
		,@GetMethod
		,@SetMethod
		,@IsReadOnly
		,@Aliases
		,@PropertyName
		,@UseChangeEvent
		,@DefaultValue
		,@IsEnum
		,@IncludeInSetValue);
	SET @FieldID = SCOPE_IDENTITY();
	
END


GO
/****** Object:  StoredProcedure [sword].[Field_Update]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Field_Update]

	@FieldID int,
	@ObjectID int,
	@TableName varchar(50),
	@Include bit,
	@JsonSerializable bit,
	@XmlSerializable bit,
	@SqlDbType int,
	@UDT varchar(50),
	@GetMethod varchar(1000),
	@SetMethod varchar(1000),
	@IsReadOnly bit,
	@Aliases varchar(1000),
	@PropertyName varchar(50),
	@UseChangeEvent bit,
	@DefaultValue varchar(100),
	@IsEnum bit,
	@IncludeInSetValue bit

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	UPDATE sword.Fields
	SET 
      TableName = @TableName
      ,[Include] = @Include
      ,JsonSerializable = @JsonSerializable
      ,XmlSerializable = @XmlSerializable
      ,SqlDbType = @SqlDbType
      ,UDT = @UDT
      ,GetMethod = @GetMethod
      ,SetMethod = @SetMethod
      ,IsReadOnly = @IsReadOnly
      ,Aliases = @Aliases
      ,PropertyName = @PropertyName
      ,UseChangeEvent = @UseChangeEvent
      ,DefaultValue = @DefaultValue
      ,IsEnum = @IsEnum
      ,IncludeInSetValue = @IncludeInSetValue
	WHERE 
		FieldID = @FieldID;
	
END


GO
/****** Object:  StoredProcedure [sword].[Object_Delete]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Object_Delete]

	@ObjectID int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DELETE FROM 
		sword.[Objects]
	WHERE 
		ObjectID = @ObjectID;
	
END


GO
/****** Object:  StoredProcedure [sword].[Object_Get]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Object_Get]

	@ProjectID int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SELECT 
		[ObjectID]
		,[ClassName]
		,[TableName]
		,[ConnectionID]
		,[ProjectID]
		,[Target]
		,[UseObjectState]
		,[UseChangeEvent]
		,[UserCode]
		,[Namespace]
		,[IsPartial]
		,[PK]
		,[DefaultConnectionString]
		,[AllowDeletes]
		,[AllowInserts]
		,[ScopeID]
	FROM 
		sword.[Objects]
	WHERE 
		ProjectID = @ProjectID
	ORDER BY 
		ClassName;
	
END


GO
/****** Object:  StoredProcedure [sword].[Object_Insert]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Object_Insert]

	@ObjectID int output,
	@ClassName varchar(50),
	@TableName varchar(255),
	@ConnectionID int,
	@ProjectID int,
	@Target varchar(255),
	@UseObjectState bit,
	@UseChangeEvent bit,	
	@UserCode varchar(max),
	@Namespace varchar(255),
	@IsPartial bit,
	@PK varchar(100),
	@DefaultConnectionString varchar(255),
	@AllowDeletes bit,
	@AllowInserts bit,
	@ScopeID varchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	INSERT INTO sword.[Objects]
		(ClassName
		,TableName
		,ConnectionID
		,ProjectID
		,[Target]
		,UseObjectState
		,UseChangeEvent
		,UserCode
		,[Namespace]
		,IsPartial
		,PK
		,DefaultConnectionString
		,AllowDeletes
		,AllowInserts
		,ScopeID)
     VALUES
		(@ClassName
		,@TableName
		,@ConnectionID
		,@ProjectID
		,@Target
		,@UseObjectState
		,@UseChangeEvent
		,@UserCode
		,@Namespace
		,@IsPartial
		,@PK
		,@DefaultConnectionString
		,@AllowDeletes
		,@AllowInserts
		,@ScopeID);
	SET @ObjectID = SCOPE_IDENTITY();
	
END


GO
/****** Object:  StoredProcedure [sword].[Object_Update]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Object_Update]

	@ObjectID int,
	@ClassName varchar(50),
	@TableName varchar(255),
	@ConnectionID int,
	@ProjectID int,
	@Target varchar(255),
	@UseObjectState bit,
	@UseChangeEvent bit,	
	@UserCode varchar(max),
	@Namespace varchar(255),
	@IsPartial bit,
	@PK varchar(100),
	@DefaultConnectionString varchar(255),
	@AllowDeletes bit,
	@AllowInserts bit,
	@ScopeID varchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	UPDATE sword.[Objects]
	SET 
		ClassName = @ClassName
		,TableName = @TableName
		,ConnectionID = @ConnectionID
		,ProjectID = @ProjectID
		,[Target] = @Target
		,UseObjectState = @UseObjectState
		,UseChangeEvent = @UseChangeEvent		
		,UserCode = @UserCode
		,[Namespace] = @Namespace
		,IsPartial = @IsPartial
		,PK = @PK
		,DefaultConnectionString = @DefaultConnectionString
		,AllowDeletes = @AllowDeletes
		,AllowInserts = @AllowInserts
		,ScopeID = @ScopeID
	WHERE
		ObjectID = @ObjectID;
	
END


GO
/****** Object:  StoredProcedure [sword].[Parameter_Delete]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Parameter_Delete]

	@ParameterID int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DELETE FROM 
		sword.[Parameters]
	WHERE 
		ParameterID = @ParameterID;
	
END


GO
/****** Object:  StoredProcedure [sword].[Parameter_Get]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Parameter_Get]

	@ProcedureID int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SELECT 
		ParameterID
		,ProcedureID
		,Scale
		,SqlDbType
		,[Precision]
		,Size
		,Direction
		,DefaultValue
		,Name
		,SourceColumn
	FROM 
		sword.[Parameters]
	WHERE 
		ProcedureID = @ProcedureID;
	
END


GO
/****** Object:  StoredProcedure [sword].[Parameter_Insert]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Parameter_Insert]

	@ParameterID int output,
	@ProcedureID int,
	@Scale tinyint,
	@SqlDbType int,
	@Precision tinyint,
	@Size int,
	@Direction int,
	@DefaultValue varchar(50),
	@Name varchar(50),
	@SourceColumn varchar(100)
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	INSERT INTO sword.[Parameters]
		(ProcedureID
		,Scale
		,SqlDbType
		,[Precision]
		,Size
		,Direction
		,DefaultValue
		,Name
		,SourceColumn)
     VALUES
		(@ProcedureID
		,@Scale
		,@SqlDbType
		,@Precision
		,@Size
		,@Direction
		,@DefaultValue
		,@Name
		,@SourceColumn);
	SET @ParameterID = SCOPE_IDENTITY();
	
END


GO
/****** Object:  StoredProcedure [sword].[Parameter_Update]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Parameter_Update]

	@ParameterID int,
	@ProcedureID int,
	@Scale tinyint,
	@SqlDbType int,
	@Precision tinyint,
	@Size int,
	@Direction int,
	@DefaultValue varchar(50),
	@Name varchar(50),
	@SourceColumn varchar(100)
	
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	UPDATE sword.[Parameters]
	SET 		
		Scale = @Scale
		,SqlDbType = @SqlDbType
		,[Precision] = @Precision
		,Size = @Size
		,Direction = @Direction
		,DefaultValue = @DefaultValue
		,Name = @Name
		,SourceColumn = @SourceColumn
	WHERE	
		ParameterID = @ParameterID;


	
END


GO
/****** Object:  StoredProcedure [sword].[Procedure_Delete]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Procedure_Delete]

	@ProcedureID int
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DELETE FROM 
		sword.[Procedures]
	WHERE
		ProcedureID = @ProcedureID;
	
END


GO
/****** Object:  StoredProcedure [sword].[Procedure_Get]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Procedure_Get]

	@ObjectID int
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SELECT 
		ProcedureID
		,ObjectID
		,CommandType
		,ConnectionID
		,StaticConnectionString
		,CommandText
		,ProcedureType
		,Name
	FROM 
		sword.[Procedures]
	WHERE
		ObjectID = @ObjectID;
	
END


GO
/****** Object:  StoredProcedure [sword].[Procedure_Insert]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Procedure_Insert]

	@ProcedureID int output,
	@ObjectID int,
	@CommandType int,
	@ConnectionID int,
	@StaticConnectionString varchar(50),
	@CommandText varchar(2000),
	@ProcedureType int,
	@Name varchar(50)
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	INSERT INTO sword.[Procedures]
		(ObjectID
		,CommandType
		,ConnectionID
		,StaticConnectionString
		,CommandText
		,ProcedureType
		,Name)
     VALUES
        (@ObjectID
		,@CommandType
		,@ConnectionID
		,@StaticConnectionString
		,@CommandText
		,@ProcedureType
		,@Name);
	SET @ProcedureID = SCOPE_IDENTITY();
	
END


GO
/****** Object:  StoredProcedure [sword].[Procedure_Update]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Procedure_Update]

	@ProcedureID int,
	@ObjectID int,
	@CommandType int,
	@ConnectionID int,
	@StaticConnectionString varchar(50),
	@CommandText varchar(2000),
	@ProcedureType int,
	@Name varchar(50)
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	UPDATE sword.[Procedures]
	SET 
		ObjectID = @ObjectID
		,CommandType = @CommandType
		,ConnectionID = @ConnectionID
		,StaticConnectionString = @StaticConnectionString
		,CommandText = @CommandText
		,ProcedureType = @ProcedureType
		,Name = @Name
	WHERE
		ProcedureID = @ProcedureID;
	
END


GO
/****** Object:  StoredProcedure [sword].[Project_Get]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Project_Get]
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SELECT 
		ProjectID
		,Name
		,BuildPath
		,PublishPath
		,[Namespace]
		,DefaultConnectionString
	FROM 
		sword.Projects 
	ORDER BY
		Name;

	
END


GO
/****** Object:  StoredProcedure [sword].[Project_Insert]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Project_Insert]
	
	@ProjectID int output,
	@Name varchar(100),
	@BuildPath varchar(255),
	@PublishPath varchar(255),
	@Namespace varchar(255),
	@DefaultConnectionString varchar(255)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	INSERT INTO sword.Projects
		(Name
		,BuildPath
		,PublishPath
		,[Namespace]
		,DefaultConnectionString)
     VALUES
		(@Name
		,@BuildPath
		,@PublishPath
		,@Namespace
		,@DefaultConnectionString);
	SET @ProjectID = SCOPE_IDENTITY();

	
END


GO
/****** Object:  StoredProcedure [sword].[Project_Update]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[Project_Update]
	
	@ProjectID int,
	@Name varchar(100),
	@BuildPath varchar(255),
	@PublishPath varchar(255),
	@Namespace varchar(255),
	@DefaultConnectionString varchar(255)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	UPDATE sword.Projects
	SET 
		Name = @Name
		,BuildPath = @BuildPath
		,PublishPath = @PublishPath
		,[Namespace] = @Namespace
		,DefaultConnectionString = @DefaultConnectionString
	WHERE
		ProjectID = @ProjectID;

	
END


GO
/****** Object:  StoredProcedure [sword].[ProjectProcedure_Delete]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[ProjectProcedure_Delete]

	@ProjectProcedureID int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	DELETE FROM sword.ProjectProcedures
    WHERE 
		ProjectProcedureID = @ProjectProcedureID;
	
END


GO
/****** Object:  StoredProcedure [sword].[ProjectProcedure_Get]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[ProjectProcedure_Get]
	-- Add the parameters for the stored procedure here
	@ProjectID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT     ProjectProcedureID, ProjectID, CommandText, Alias, Wrapper
	FROM         sword.ProjectProcedures
	WHERE     (ProjectID = @ProjectID)
	ORDER BY 
		CASE WHEN Wrapper IS NOT NULL THEN Wrapper ELSE 'ZZZZ' END,
		Alias;
	
END


GO
/****** Object:  StoredProcedure [sword].[ProjectProcedure_Insert]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[ProjectProcedure_Insert]

	@ProjectProcedureID int output,
	@ProjectID int,
	@CommandText varchar(100),
	@Alias varchar(100),
	@Wrapper varchar(100)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO sword.ProjectProcedures
           (
           ProjectID
           ,CommandText
           ,Alias
           ,Wrapper)
     VALUES
           (
           @ProjectID
           ,@CommandText
           ,@Alias
           ,@Wrapper);
           
	SET @ProjectProcedureID= SCOPE_IDENTITY();
	
END


GO
/****** Object:  StoredProcedure [sword].[ProjectProcedure_Update]    Script Date: 10/21/2014 9:48:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [sword].[ProjectProcedure_Update]

	@ProjectProcedureID int,
	@ProjectID int,
	@CommandText varchar(100),
	@Alias varchar(100),
	@Wrapper varchar(100)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	UPDATE sword.ProjectProcedures
	SET
		[CommandText] = @CommandText
		,[Alias] = @Alias
		,[Wrapper] = @Wrapper
	WHERE 
		ProjectProcedureID = @ProjectProcedureID;
	
	
END


GO
