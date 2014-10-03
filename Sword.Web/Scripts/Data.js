///<reference path="../Scripts/Bastard.ts"/>
///<reference path="../Scripts/View.ts"/>
var Data;
(function (Data) {
    Data.Views = new Array();
    Data.ProjectID = 0;
    Data.Projects;
    Data.Connections;
    function SelectedProject() {
        var _this = this;
        return Data.Projects.First(function (o) {
            return o.ProjectID == _this.ProjectID;
        });
    }
    Data.SelectedProject = SelectedProject;
    Data.Items;

    //     Specifies SQL Server-specific data type of a field, property, for use in
    //     a System.Data.SqlClient.SqlParameter.
    (function (SqlDbType) {
        // Summary:
        //     System.Int64. A 64-bit signed integer.
        SqlDbType[SqlDbType["BigInt"] = 0] = "BigInt";

        //
        // Summary:
        //     System.Array of type System.Byte. A fixed-length stream of binary data ranging
        //     between 1 and 8,000 bytes.
        SqlDbType[SqlDbType["Binary"] = 1] = "Binary";

        //
        // Summary:
        //     System.Boolean. An unsigned numeric value that can be 0, 1, or null.
        SqlDbType[SqlDbType["Bit"] = 2] = "Bit";

        //
        // Summary:
        //     System.String. A fixed-length stream of non-Unicode characters ranging between
        //     1 and 8,000 characters.
        SqlDbType[SqlDbType["Char"] = 3] = "Char";

        //
        // Summary:
        //     System.DateTime. Date and time data ranging in value from January 1, 1753
        //     to December 31, 9999 to an accuracy of 3.33 milliseconds.
        SqlDbType[SqlDbType["DateTime"] = 4] = "DateTime";

        //
        // Summary:
        //     System.Decimal. A fixed precision and scale numeric value between -10 38
        //     -1 and 10 38 -1.
        SqlDbType[SqlDbType["Decimal"] = 5] = "Decimal";

        //
        // Summary:
        //     System.Double. A floating point number within the range of -1.79E +308 through
        //     1.79E +308.
        SqlDbType[SqlDbType["Float"] = 6] = "Float";

        //
        // Summary:
        //     System.Array of type System.Byte. A variable-length stream of binary data
        //     ranging from 0 to 2 31 -1 (or 2,147,483,647) bytes.
        SqlDbType[SqlDbType["Image"] = 7] = "Image";

        //
        // Summary:
        //     System.Int32. A 32-bit signed integer.
        SqlDbType[SqlDbType["Int"] = 8] = "Int";

        //
        // Summary:
        //     System.Decimal. A currency value ranging from -2 63 (or -9,223,372,036,854,775,808)
        //     to 2 63 -1 (or +9,223,372,036,854,775,807) with an accuracy to a ten-thousandth
        //     of a currency unit.
        SqlDbType[SqlDbType["Money"] = 9] = "Money";

        //
        // Summary:
        //     System.String. A fixed-length stream of Unicode characters ranging between
        //     1 and 4,000 characters.
        SqlDbType[SqlDbType["NChar"] = 10] = "NChar";

        //
        // Summary:
        //     System.String. A variable-length stream of Unicode data with a maximum length
        //     of 2 30 - 1 (or 1,073,741,823) characters.
        SqlDbType[SqlDbType["NText"] = 11] = "NText";

        //
        // Summary:
        //     System.String. A variable-length stream of Unicode characters ranging between
        //     1 and 4,000 characters. Implicit conversion fails if the string is greater
        //     than 4,000 characters. Explicitly set the object when working with strings
        //     longer than 4,000 characters.
        SqlDbType[SqlDbType["NVarChar"] = 12] = "NVarChar";

        //
        // Summary:
        //     System.Single. A floating point number within the range of -3.40E +38 through
        //     3.40E +38.
        SqlDbType[SqlDbType["Real"] = 13] = "Real";

        //
        // Summary:
        //     System.Guid. A globally unique identifier (or GUID).
        SqlDbType[SqlDbType["UniqueIdentifier"] = 14] = "UniqueIdentifier";

        //
        // Summary:
        //     System.DateTime. Date and time data ranging in value from January 1, 1900
        //     to June 6, 2079 to an accuracy of one minute.
        SqlDbType[SqlDbType["SmallDateTime"] = 15] = "SmallDateTime";

        //
        // Summary:
        //     System.Int16. A 16-bit signed integer.
        SqlDbType[SqlDbType["SmallInt"] = 16] = "SmallInt";

        //
        // Summary:
        //     System.Decimal. A currency value ranging from -214,748.3648 to +214,748.3647
        //     with an accuracy to a ten-thousandth of a currency unit.
        SqlDbType[SqlDbType["SmallMoney"] = 17] = "SmallMoney";

        //
        // Summary:
        //     System.String. A variable-length stream of non-Unicode data with a maximum
        //     length of 2 31 -1 (or 2,147,483,647) characters.
        SqlDbType[SqlDbType["Text"] = 18] = "Text";

        //
        // Summary:
        //     System.Array of type System.Byte. Automatically generated binary numbers,
        //     which are guaranteed to be unique within a database. timestamp is used typically
        //     as a mechanism for version-stamping table rows. The storage size is 8 bytes.
        SqlDbType[SqlDbType["Timestamp"] = 19] = "Timestamp";

        //
        // Summary:
        //     System.Byte. An 8-bit unsigned integer.
        SqlDbType[SqlDbType["TinyInt"] = 20] = "TinyInt";

        //
        // Summary:
        //     System.Array of type System.Byte. A variable-length stream of binary data
        //     ranging between 1 and 8,000 bytes. Implicit conversion fails if the byte
        //     array is greater than 8,000 bytes. Explicitly set the object when working
        //     with byte arrays larger than 8,000 bytes.
        SqlDbType[SqlDbType["VarBinary"] = 21] = "VarBinary";

        //
        // Summary:
        //     System.String. A variable-length stream of non-Unicode characters ranging
        //     between 1 and 8,000 characters.
        SqlDbType[SqlDbType["VarChar"] = 22] = "VarChar";

        //
        // Summary:
        //     System.Object. A special data type that can contain numeric, string, binary,
        //     or date data as well as the SQL Server values Empty and Null, which is assumed
        //     if no other type is declared.
        SqlDbType[SqlDbType["Variant"] = 23] = "Variant";

        //
        // Summary:
        //     An XML value. Obtain the XML as a string using the System.Data.SqlClient.SqlDataReader.GetValue(System.Int32)
        //     method or System.Data.SqlTypes.SqlXml.Value property, or as an System.Xml.XmlReader
        //     by calling the System.Data.SqlTypes.SqlXml.CreateReader() method.
        SqlDbType[SqlDbType["Xml"] = 25] = "Xml";

        //
        // Summary:
        //     A SQL Server 2005 user-defined type (UDT).
        SqlDbType[SqlDbType["Udt"] = 29] = "Udt";

        //
        // Summary:
        //     A special data type for specifying structured data contained in table-valued
        //     parameters.
        SqlDbType[SqlDbType["Structured"] = 30] = "Structured";

        //
        // Summary:
        //     Date data ranging in value from January 1,1 AD through December 31, 9999
        //     AD.
        SqlDbType[SqlDbType["Date"] = 31] = "Date";

        //
        // Summary:
        //     Time data based on a 24-hour clock. Time value range is 00:00:00 through
        //     23:59:59.9999999 with an accuracy of 100 nanoseconds. Corresponds to a SQL
        //     Server time value.
        SqlDbType[SqlDbType["Time"] = 32] = "Time";

        //
        // Summary:
        //     Date and time data. Date value range is from January 1,1 AD through December
        //     31, 9999 AD. Time value range is 00:00:00 through 23:59:59.9999999 with an
        //     accuracy of 100 nanoseconds.
        SqlDbType[SqlDbType["DateTime2"] = 33] = "DateTime2";

        //
        // Summary:
        //     Date and time data with time zone awareness. Date value range is from January
        //     1,1 AD through December 31, 9999 AD. Time value range is 00:00:00 through
        //     23:59:59.9999999 with an accuracy of 100 nanoseconds. Time zone value range
        //     is -14:00 through +14:00.
        SqlDbType[SqlDbType["DateTimeOffset"] = 34] = "DateTimeOffset";
    })(Data.SqlDbType || (Data.SqlDbType = {}));
    var SqlDbType = Data.SqlDbType;
})(Data || (Data = {}));
//# sourceMappingURL=Data.js.map
