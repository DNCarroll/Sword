using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Sword;

namespace Sword.SelectBuilder
{
    public class Select
    {
        public Select() { }

        #region Depricated for now for consistency

        //public Select(dynamic select, object from)
        //{
        //}

        //public Select(dynamic select, object from, bool where)
        //{
        //}

        //public Select(dynamic select, object from, JOIN[] joins, bool where)
        //{
        //}

        //public Select(dynamic select, object from, JOIN[] joins, bool where, dynamic groupBy)
        //{
        //}

        //public Select(dynamic select, object from, JOIN[] joins, bool where, dynamic groupBy, params ORDERBY[] orderBy)
        //{
        //}

        #endregion

        public dynamic Fields { get; set; }        

        public int Top { get; set; }

        public object From { get; set; }

        private JOIN[] _Joins;
        public JOIN[] Join
        {
            get { return _Joins; }
            set { _Joins = value; }
        }

        public bool Where { get; set; }

        public dynamic GroupBy { get; set; }

        private ORDERBY[] _ORDERBY;
        public ORDERBY[] OrderBy
        {
            get { return _ORDERBY; }
            set { _ORDERBY = value; }
        }

    }

    public enum JOINTYPE
    {
        INNER,
        LEFT,
    }

    public class JOIN
    {
        public JOIN(object from, bool on, JOINTYPE type = JOINTYPE.INNER)
        {
            this.JOINTYPE = type;
            this.FROM = from;
            this.ON = on;
        }

        public object FROM { get; set; }

        public JOINTYPE JOINTYPE { get; set; }

        public bool ON { get; set; }

        public static JOIN INNER(object from, bool on)
        {
            var join = new JOIN(from, on);
            return join;
        }

        public static JOIN LEFT(object from, bool on)
        {
            var join = new JOIN(from, on, JOINTYPE.LEFT);
            return join;
        }
    }

    public enum ORDERTYPE
    {
        ASC,
        DESC
    }

    public class ORDERBY
    {
        public ORDERTYPE ORDERTYPE { get; set; }

        public dynamic FIELD { get; set; }

        public ORDERBY(dynamic field, ORDERTYPE orderType = ORDERTYPE.ASC)
        {
        }

        public static ORDERBY ASC(dynamic field)
        {
            return new ORDERBY(field);
        }

        public static ORDERBY DESC(dynamic field)
        {
            return new ORDERBY(field, ORDERTYPE.DESC);
        }

    }

    //public interface ISqlSword
    //{        
    //    Tuple<LambdaExpression, string[]> Selector { get; set; }
    //    List<Tuple<string, LambdaExpression, string>> Joins { get; set; }
    //    Tuple<LambdaExpression, string[]> Where { get; set; }
    //    string[] Tables { get; }
    //    string ConnectionString { get; }        
    //}

    //public abstract class SqlSword : ISqlSword
    //{

    //    private Tuple<LambdaExpression, string[]> _Selector;
    //    public Tuple<LambdaExpression, string[]> Selector
    //    {
    //        get { return _Selector; }
    //        set { _Selector = value; }
    //    }

    //    private List<Tuple<string, LambdaExpression, string>> _Joins = new List<Tuple<string, LambdaExpression, string>>();
    //    public List<Tuple<string, LambdaExpression, string>> Joins
    //    {
    //        get { return _Joins; }
    //        set { _Joins = value; }
    //    }

    //    private Tuple<LambdaExpression, string[]> _Where;
    //    public Tuple<LambdaExpression, string[]> Where
    //    {
    //        get { return _Where; }
    //        set { _Where = value; }
    //    }

    //    public abstract string[] Tables { get; }
    //    public abstract string ConnectionString { get; }
    //    public abstract IDynamic[] Objects { get; }

    //}

    //public class SqlSword<T0, T1> : SqlSword
    //    where T0 : IDynamic, new()
    //    where T1 : IDynamic, new()
    //{


    //    public SqlSword() { 
        
    //    }

    //    public override string[] Tables
    //    {
    //        get { return new string[] { new T0().Table, new T1().Table }; }
    //    }

    //    public override string ConnectionString
    //    {
    //        get { return new T0().ObjectConnectionString; }
    //    }

    //    public override IDynamic[] Objects
    //    {
    //        get { throw new NotImplementedException(); }
    //    }
    //}

    //public class SqlSword<T0, T1, T2> : SqlSword
    //    where T0 : IDynamic, new()
    //    where T1 : IDynamic, new()
    //    where T2 : IDynamic, new()
    //{

    //    public SqlSword() { }

    //    public override string[] Tables
    //    {
    //        get { return new string[] { new T0().Table, new T1().Table, new T2().Table }; }
    //    }

    //    public override string ConnectionString
    //    {
    //        get { return new T0().ObjectConnectionString; }
    //    }
    //}

    //public class SqlSword<T0, T1, T2, T3> : SqlSword
    //    where T0 : IDynamic, new()
    //    where T1 : IDynamic, new()
    //    where T2 : IDynamic, new()
    //    where T3 : IDynamic, new()
    //{

    //    public SqlSword() { }

    //    public override string[] Tables
    //    {
    //        get { return new string[] { new T0().Table, new T1().Table, new T2().Table, new T3().Table }; }
    //    }

    //    public override string ConnectionString
    //    {
    //        get { return new T0().ObjectConnectionString; }
    //    }
    //}



    //public class DynamicSelector 
    //{

    //    private Tuple<LambdaExpression, string[]> _Selector;
    //    public Tuple<LambdaExpression, string[]> Selector
    //    {
    //        get { return _Selector; }
    //        set { _Selector = value; }
    //    }

    //    private List<Tuple<string, LambdaExpression, string>> _Joins = new List<Tuple<string, LambdaExpression, string>>();
    //    public List<Tuple<string, LambdaExpression, string>> Joins
    //    {
    //        get { return _Joins; }
    //        set { _Joins = value; }
    //    }

    //    private Tuple<LambdaExpression, string[]> _Where;
    //    public Tuple<LambdaExpression, string[]> Where
    //    {
    //        get { return _Where; }
    //        set { _Where = value; }
    //    }

    //    private List<IDynamic> _ReferenceObjects = new List<IDynamic>();
    //    public List<IDynamic> ReferenceObjects
    //    {
    //        get { return _ReferenceObjects; }
    //        set { _ReferenceObjects = value; }
    //    }

    //    public void AddObjectType<T>()
    //        where T: IDynamic, new()
    //    {
    //        var newT = new T();
    //        var exists = this.ReferenceObjects.FirstOrDefault(o => o.GetType() == newT.GetType());
    //        if (exists == null)
    //        {
    //            this.ReferenceObjects.Add(new T());
    //        }
    //    }

    //}


    //public static class Sql
    //{

    //    public static DynamicSelector Select<T0>(Expression<Func<T0, dynamic>> selector)
    //        where T0 : IDynamic, new()
    //    {
    //        try
    //        {
    //            DynamicSelector sqlObject = new DynamicSelector();
    //            sqlObject.AddObjectType<T0>();
    //            sqlObject.Selector = new Tuple<LambdaExpression, string[]>(selector, new string[] { new T0().Table });
    //            return sqlObject;
    //        }
    //        catch (Exception)
    //        {
    //            throw;
    //        }
    //    }

    //    public static DynamicSelector Select<T0, T1>(Expression<Func<T0, T1, dynamic>> selector)
    //        where T0 : IDynamic, new()
    //        where T1 : IDynamic, new()
    //    {
    //        try
    //        {
    //            DynamicSelector sqlObject = new DynamicSelector();
    //            sqlObject.AddObjectType<T0>();
    //            sqlObject.AddObjectType<T1>();
    //            sqlObject.Selector = new Tuple<LambdaExpression, string[]>(selector, new string[] { new T0().Table, new T1().Table }); 
    //            return sqlObject;
    //        }
    //        catch (Exception)
    //        {
    //            throw;
    //        }
    //    }

    //    public static DynamicSelector Select<T0, T1, T2>(Expression<Func<T0, T1, T2, dynamic>> selector)
    //        where T0 : IDynamic, new()
    //        where T1 : IDynamic, new()
    //        where T2 : IDynamic, new()
    //    {
    //        try
    //        {
    //            DynamicSelector sqlObject = new DynamicSelector();
    //            sqlObject.AddObjectType<T0>();
    //            sqlObject.AddObjectType<T1>();
    //            sqlObject.AddObjectType<T2>();
    //            sqlObject.Selector = new Tuple<LambdaExpression, string[]>(selector, new string[] { new T0().Table, new T1().Table, new T2().Table }); 
    //            return sqlObject;
    //        }
    //        catch (Exception)
    //        {
    //            throw;
    //        }
    //    }

    //    public static DynamicSelector Select<T0, T1, T2, T3>(Expression<Func<T0, T1, T2, T3, dynamic>> selector)
    //        where T0 : IDynamic, new()
    //        where T1 : IDynamic, new()
    //        where T2 : IDynamic, new()
    //        where T3 : IDynamic, new()
    //    {
    //        try
    //        {
    //            DynamicSelector sqlObject = new DynamicSelector();
    //            sqlObject.AddObjectType<T0>();
    //            sqlObject.AddObjectType<T1>();
    //            sqlObject.AddObjectType<T2>();
    //            sqlObject.AddObjectType<T3>();
    //            sqlObject.Selector = new Tuple<LambdaExpression, string[]>(selector, new string[] { new T0().Table, new T1().Table, new T2().Table, new T3().Table });
    //            return sqlObject;
    //        }
    //        catch (Exception)
    //        {
    //            throw;
    //        }
    //    }

    //    public static DynamicSelector Inner<TTarget, TRef>(this DynamicSelector sqlobject, Expression<Func<TRef, TTarget, bool>> value)
    //        where TTarget : IDynamic, new()
    //    {
    //        try
    //        {
    //            sqlobject.AddObjectType<TTarget>();
    //            sqlobject.Joins.Add(new Tuple<string, LambdaExpression, string>(new TTarget().Table, value, " INNER JOIN "));
    //            return sqlobject;
    //        }
    //        catch (Exception)
    //        {
    //            throw;
    //        }
    //    }

    //    public static DynamicSelector Inner<TTarget, TRef0, TRef1>(this DynamicSelector sqlobject, Expression<Func<TRef0, TRef1, TTarget, bool>> value)
    //        where TTarget : IDynamic, new()
    //    {
    //        try
    //        {
    //            sqlobject.AddObjectType<TTarget>();                
    //            sqlobject.Joins.Add(new Tuple<string, LambdaExpression, string>(new TTarget().Table, value, " INNER JOIN "));
    //            return sqlobject;
    //        }
    //        catch (Exception)
    //        {
    //            throw;
    //        }
    //    }

    //    public static DynamicSelector Inner<TTarget, TRef0, TRef1, TRef2>(this DynamicSelector sqlobject, Expression<Func<TRef0, TRef1, TRef2, TTarget, bool>> value)
    //        where TTarget : IDynamic, new()
    //    {
    //        try
    //        {
    //            sqlobject.AddObjectType<TTarget>();
    //            sqlobject.Joins.Add(new Tuple<string, LambdaExpression, string>(new TTarget().Table, value, " INNER JOIN "));
    //            return sqlobject;
    //        }
    //        catch (Exception)
    //        {
    //            throw;
    //        }
    //    }

    //    public static DynamicSelector Left<TTarget, TRef>(this DynamicSelector sqlobject, Expression<Func<TRef, TTarget, bool>> value)
    //        where TTarget : IDynamic, new()
    //    {
    //        try
    //        {
    //            sqlobject.AddObjectType<TTarget>();
    //            sqlobject.Joins.Add(new Tuple<string, LambdaExpression, string>(new TTarget().Table, value, " LEFT JOIN "));
    //            return sqlobject;
    //        }
    //        catch (Exception)
    //        {
    //            throw;
    //        }
    //    }

    //    public static DynamicSelector Left<TTarget, TRef0, TRef1>(this DynamicSelector sqlobject, Expression<Func<TRef0, TRef1, TTarget, bool>> value)
    //        where TTarget : IDynamic, new()
    //    {
    //        try
    //        {
    //            sqlobject.AddObjectType<TTarget>();
    //            sqlobject.Joins.Add(new Tuple<string, LambdaExpression, string>(new TTarget().Table, value, " LEFT JOIN "));
    //            return sqlobject;
    //        }
    //        catch (Exception)
    //        {
    //            throw;
    //        }
    //    }

    //    public static DynamicSelector Left<TTarget, TRef0, TRef1, TRef2>(this DynamicSelector sqlobject, Expression<Func<TRef0, TRef1, TRef2, TTarget, bool>> value)
    //        where TTarget : IDynamic, new()
    //    {
    //        try
    //        {
    //            sqlobject.AddObjectType<TTarget>();
    //            sqlobject.Joins.Add(new Tuple<string, LambdaExpression, string>(new TTarget().Table, value, " LEFT JOIN "));
    //            return sqlobject;
    //        }
    //        catch (Exception)
    //        {
    //            throw;
    //        }
    //    }

    //    public static DynamicSelector Where<T0>(this DynamicSelector sqlSword, Expression<Func<T0, bool>> value)
    //        where T0: IDynamic, new()
    //    {
    //        try
    //        {
    //            sqlSword.Where = new Tuple<LambdaExpression, string[]>(value, new string[] { new T0().Table });
    //            return sqlSword;
    //        }
    //        catch (Exception)
    //        {

    //            throw;
    //        }
    //    }

    //    public static DynamicSelector Where<T0, T1>(this DynamicSelector sqlSword, Expression<Func<T0, T1, bool>> value)
    //        where T0 : IDynamic, new()
    //        where T1 : IDynamic, new()
    //    {
    //        try
    //        {
    //            sqlSword.Where = new Tuple<LambdaExpression, string[]>(value, new string[] { new T0().Table, new    T1().Table });
    //            return sqlSword;
    //        }
    //        catch (Exception)
    //        {

    //            throw;
    //        }
    //    }

    //    public static DynamicSelector Where<T0, T1, T2>(this DynamicSelector sqlSword, Expression<Func<T0, T1, T2, bool>> value)
    //        where T0 : IDynamic, new()
    //        where T1 : IDynamic, new()
    //        where T2 : IDynamic, new()
    //    {
    //        try
    //        {
    //            sqlSword.Where = new Tuple<LambdaExpression, string[]>(value, new string[] { new T0().Table, new T1().Table, new T2().Table });
    //            return sqlSword;
    //        }
    //        catch (Exception)
    //        {

    //            throw;
    //        }
    //    }

    //    public static DynamicSelector Where<T0, T1, T2, T3>(this DynamicSelector sqlSword, Expression<Func<T0, T1, T2, bool>> value)
    //        where T0 : IDynamic, new()
    //        where T1 : IDynamic, new()
    //        where T2 : IDynamic, new()
    //        where T3 : IDynamic, new()
    //    {
    //        try
    //        {
    //            sqlSword.Where = new Tuple<LambdaExpression, string[]>(value, new string[] { new T0().Table, new T1().Table, new T2().Table, new T3().Table });
    //            return sqlSword;
    //        }
    //        catch (Exception)
    //        {

    //            throw;
    //        }
    //    }

    //}

    public static class Build
    {
        public static Tuple<List<IDynamic>, LambdaExpression> Statement<T>(Expression<Func<T, Select>> statementExpression)
            where T:IDynamic, new()
        {
            return new Tuple<List<IDynamic>, LambdaExpression>(new List<IDynamic>() { new T() }, statementExpression);
        }

        public static Tuple<List<IDynamic>, LambdaExpression> Statement<T0, T1>(Expression<Func<T0, T1, Select>> statementExpression)
            where T0 : IDynamic, new()
            where T1 : IDynamic, new()
        {
            return new Tuple<List<IDynamic>, LambdaExpression>(new List<IDynamic>() { new T0(), new T1() }, statementExpression);
        }

        public static Tuple<List<IDynamic>, LambdaExpression> Statement<T0, T1, T2>(Expression<Func<T0, T1, T2, Select>> statementExpression)
            where T0 : IDynamic, new()
            where T1 : IDynamic, new()
            where T2 : IDynamic, new()
        {
            return new Tuple<List<IDynamic>, LambdaExpression>(new List<IDynamic>() { new T0(), new T1(), new T2() }, statementExpression);
        }


        #region Depricated for now for consistency

        //public static JOIN[] Add(this JOIN existing, JOIN value)
        //{
        //    JOIN[] ret = new JOIN[2];
        //    ret[0] = existing;
        //    ret[1] = value;
        //    return ret;
        //}

        //public static JOIN[] Add(this JOIN[] existing, JOIN value)
        //{
        //    JOIN[] ret = new JOIN[existing.Length];
        //    for (int i = 0; i < existing.Length; i++)
        //    {
        //        ret[i] = existing[i];
        //    }
        //    ret[existing.Length] = value;
        //    return ret;
        //}

        //public static ORDERBY[] Add(this ORDERBY existing, ORDERBY value)
        //{
        //    ORDERBY[] ret = new ORDERBY[2];
        //    ret[0] = existing;
        //    ret[1] = value;
        //    return ret;
        //}

        //public static ORDERBY[] Add(this ORDERBY[] existing, ORDERBY value)
        //{
        //    ORDERBY[] ret = new ORDERBY[existing.Length];
        //    for (int i = 0; i < existing.Length; i++)
        //    {
        //        ret[i] = existing[i];
        //    }
        //    ret[existing.Length] = value;
        //    return ret;
        //}

        #endregion

        public static string GetBody(this Tuple<List<IDynamic>, LambdaExpression> item)
        {
            return item.Item2.Body.ToString();
        }
    }
}
