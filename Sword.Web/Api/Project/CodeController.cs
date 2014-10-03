using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;

namespace Sword.Web.Api.Project
{
    public class CodeController : ApiController
    {
        [HttpPatch]
        public string Project([FromBody]DynamicSword obj)
        {   
            dynamic project = obj;
            var objs = Universal.Objects.ToList(new { ProjectID = project.ProjectID }).OrderBy(o=>o["ClassName"]).ToList();
            string cmd = "select TABLE_NAME TableName from INFORMATION_SCHEMA.TABLES where TABLE_TYPE ='BASE TABLE' and Table_Schema ='dbo' and Table_Name <> 'sysdiagrams' and table_Name not like 'sys%' and table_name not like 'MS%' order by TABLE_SCHEMA, TABLE_NAME";
            var connString = (string)obj["DefaultConnectionString"];
            var tables = cmd.GetCommand(connString).ToList();
            
            StringBuilder sb = new StringBuilder();
            CodeConstructor.Projects.SetUsings(sb, objs);            
            sb.AppendLine("namespace " + project.Namespace);
            sb.AppendLine("{");            
            objs.ForEach(o =>
            {
                CodeConstructor.Objects.Set(sb, o);
                sb.AppendLine();
            });
            CodeConstructor.Tables.Set(sb, tables);
            sb.AppendWithTabs("public static class Dbo", 1);
            sb.AppendWithTabs("{", 1);
            CodeConstructor.ProjectProcedures.Set(sb, obj);            
            sb.AppendWithTabs("}", 1);
            sb.AppendLine();
            CodeConstructor.ConnectionStrings.Set(sb, obj);
            sb.AppendLine();
            CodeConstructor.Enums.Set(sb, obj);
            sb.AppendLine("}");            
            return sb.ToString();
        }

        [HttpPatch]
        public string Enum([FromBody]DynamicSword obj)
        {
            return CodeConstructor.Enums.TypeScript(obj);
        }

        [HttpPatch]
        public string Items([FromBody]DynamicSword obj)
        {
            return CodeConstructor.Objects.TypeScript(obj);
        }
    }
}