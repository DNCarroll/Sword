<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Customer.aspx.cs" Inherits="Bastard.Customer" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Customer test</title>



        <% if (false)
       { %>
            <script src="Modules/Ajax.js"></script>
            <script src="Modules/Bind.js"></script>
            <script src="Modules/Browse.js"></script>
            <script src="Modules/Calendar.js"></script>
            <script src="Modules/Convert.js"></script>
            <script src="Modules/Cookie.js"></script>
            <script src="Modules/Dialog.js"></script>
            <script src="Modules/Formatters.js"></script>
            <script src="Modules/Is.js"></script>
            <script src="Modules/KeyPress.js"></script>
            <script src="Modules/Local.js"></script>
            <script src="Modules/RegularExpression.js"></script>
            <script src="Modules/Session.js"></script>
            <script src="Modules/Thing.js"></script>
            <script src="Prototypes/Array.js"></script>
            <script src="Prototypes/Date.js"></script>
            <script src="Prototypes/Element.js"></script>
            <script src="Prototypes/HTMLElement.js"></script>
            <script src="Prototypes/Select.js"></script>
            <script src="Prototypes/String.js"></script>
            <script src="Prototypes/UnorderedList.js"></script>
            <script src="Prototypes/Window.js"></script>
            <script src="Scripts/json.js"></script>
    
        
    <% } %>
            <script src="<%= ResolveUrl("~/Modules/Ajax.js") %>"></script>
            <script src="<%= ResolveUrl("~/Modules/Bind.js") %>"></script>
            <script src="<%= ResolveUrl("~/Modules/Browse.js") %>"></script>
            <script src="<%= ResolveUrl("~/Modules/Calendar.js") %>"></script>
            <script src="<%= ResolveUrl("~/Modules/Convert.js") %>"></script>
            <script src="<%= ResolveUrl("~/Modules/Cookie.js") %>"></script>
            <script src="<%= ResolveUrl("~/Modules/Dialog.js") %>"></script>
            <script src="<%= ResolveUrl("~/Modules/Formatters.js") %>"></script>
            <script src="<%= ResolveUrl("~/Modules/Is.js") %>"></script>
            <script src="<%= ResolveUrl("~/Modules/KeyPress.js") %>"></script>
            <script src="<%= ResolveUrl("~/Modules/Local.js") %>"></script>
            <script src="<%= ResolveUrl("~/Modules/RegularExpression.js") %>"></script>
            <script src="<%= ResolveUrl("~/Modules/Session.js") %>"></script>
            <script src="<%= ResolveUrl("~/Modules/Thing.js") %>"></script>
            <script src="<%= ResolveUrl("~/Prototypes/Array.js") %>"></script>
            <script src="<%= ResolveUrl("~/Prototypes/Date.js") %>"></script>
            <script src="<%= ResolveUrl("~/Prototypes/Element.js") %>"></script>
            <script src="<%= ResolveUrl("~/Prototypes/HTMLElement.js") %>"></script>
            <script src="<%= ResolveUrl("~/Prototypes/Select.js") %>"></script>
            <script src="<%= ResolveUrl("~/Prototypes/String.js") %>"></script>
            <script src="<%= ResolveUrl("~/Prototypes/UnorderedList.js") %>"></script>
            
            <script src="<%= ResolveUrl("~/Scripts/json.js") %>"></script>
    <script src="<%= ResolveUrl("~/Prototypes/Window.js") %>"></script>


    <link href="<%= ResolveUrl("~/Styles/UnorderList.css") %>" rel="stylesheet" />    
    <script>
        window.PageLoaded(function () {
            "/Api/Account".Select({ CustomerID: window.SplitPathName(1) }, function (result) {

                Bind("AccountForm".E(), result);
            });
        });
        function IsReadonly() {
            return true;
        }
    </script>
</head>
<body>  
    <div>
        <img id="progress" src="/Images/progress.gif" alt="progress" />
    </div>  
    <ul data-binding='{"PrimaryKeys":["CustomerID"]}' id="AccountForm" class="table">
        <li data-binding="Header">
            <div style="width:10em;">CustomerID</div>
            <div style="width:10em;">AccountNumber</div>
            <div style="width:10em;">Balance RO</div>
            <div style="width:10em;">Balance</div>
        </li>
        <li data-binding="Template">
            
            <div data-binding="CustomerID"></div>
            <div data-binding="AccountNumber"></div>
            <div>
            <input type="text" data-binding='{"value":"StorageBalance"                
                }' 
                readonly="readonly"
                />
                </div>
            <div>
            <input type="text" data-binding='{"value":"StorageBalance"          
                }' />
                </div>
        </li>
    </ul>    
</body>
</html>
