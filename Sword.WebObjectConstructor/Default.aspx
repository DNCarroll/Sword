<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Sword.WebObjectConstructor.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Sword UI</title>
        <meta http-equiv="X-UA-Compatible" content="IE=10; IE=9;" />
        <% if (false)
       { %>
    <%--for dev intellisense only--%>
    
    <script src="Scripts/Bastard.js"></script>
<%--    <script src="Scripts/Connections.js"></script>
    <script src="Scripts/Data.js"></script>--%>
    <script src="Scripts/Main.js"></script>
<%--    <script src="Scripts/ObjectModel.js"></script>
    <script src="Scripts/Projects.js"></script>--%>
    <script src="Scripts/View.js"></script>
    <%--<script src="Scripts/Project.js"></script>--%>


    <link href="Styles/Site.css" rel="stylesheet" title="mainSheet" />
    <link href="Styles/UnorderList.css" rel="stylesheet" />
    <link href="Styles/calendar.css" rel="stylesheet" />
    <link href="Styles/Dialogs.css" rel="stylesheet" />

    <% } %>

    <link href="<%= ResolveUrl("~/Styles/Site.css?v=201309030853") %>" rel="stylesheet" type="text/css" title="mainSheet" />
    <link href="<%= ResolveUrl("~/Styles/UnorderList.css?v=201309030853") %>" rel="stylesheet" type="text/css" />
    <link href="<%= ResolveUrl("~/Styles/calendar.css?v=201309030853") %>" rel="stylesheet" type="text/css" />
    <link href="<%= ResolveUrl("~/Styles/Dialogs.css?v=201309030853") %>" rel="stylesheet" type="text/css" />
    
</head>
<body>   
    <section>
                
    </section> 
    <section id="main">        
    </section>    

        <% 
#if DEBUG
    %>

    <script src="<%= ResolveUrl("~/Scripts/Bastard.js") %>"></script>
<%--    <script src="<%= ResolveUrl("~/Scripts/Connections.js") %>"></script>
    <script src="<%= ResolveUrl("~/Scripts/Data.js") %>"></script>    
    <script src="<%= ResolveUrl("~/Scripts/ObjectModel.js") %>"></script>
    <script src="<%= ResolveUrl("~/Scripts/Projects.js") %>"></script>--%>
    <script src="<%= ResolveUrl("~/Scripts/View.js") %>"></script>
    <%--<script src="<%= ResolveUrl("~/Scripts/Project.js") %>"></script>--%>    
    <script src="<%= ResolveUrl("~/Scripts/Main.js") %>"></script>

    <script>
        var IsDebug = true;
    </script>

    <%
#else
    %>    
    
    <%--HTML Loaded and show before javascript loads--%>
    <script src="<%= ResolveUrl("~/Scripts/Bastard.js?v=201309061506") %>"></script>
<%--    <script src="<%= ResolveUrl("~/Scripts/Connections.js?v=201309061506") %>"></script>
    <script src="<%= ResolveUrl("~/Scripts/Data.js?v=201309061506") %>"></script>    
    <script src="<%= ResolveUrl("~/Scripts/ObjectModel.js?v=201309061506") %>"></script>
    <script src="<%= ResolveUrl("~/Scripts/Projects.js?v=201309061506") %>"></script>--%>
    <script src="<%= ResolveUrl("~/Scripts/View.js?v=201309061506") %>"></script>
<%--    <script src="<%= ResolveUrl("~/Scripts/Project.js?v=201309061506") %>"></script>  --%>  
    <script src="<%= ResolveUrl("~/Scripts/Main.js?v=201309061506") %>"></script>
    
    <%
#endif
    %>

</body>






</html>
