using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using sd = System.Diagnostics;
namespace Sword.Diagnostics
{
    /// <summary>
    /// a wrapper for stopwatch class
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class Stopwatch<T>
    {
        /// <summary>
        /// 
        /// </summary>
        public Stopwatch()
        {
            this.elapsed = elapsedByMilliseconds;
        }

        private LogType m_LogType = LogType.Milliseconds;
        /// <summary>
        /// 
        /// </summary>
        public LogType LogType
        {
            get { return m_LogType; }
            set
            {
                m_LogType = value;
                if (value == Diagnostics.LogType.Ticks)
                {
                    this.elapsed = elapsedByTicks;
                }
                else
                {
                    this.elapsed = elapsedByMilliseconds;
                }
            }
        }

        long elapsedByTicks()
        {
            return internalWatch.ElapsedTicks;
        }

        long elapsedByMilliseconds()
        {
            return internalWatch.ElapsedMilliseconds;
        }

        Func<long> elapsed;

        private List<Log<T>> m_Logs = new List<Log<T>>();
        /// <summary>
        /// the logs that have been logged
        /// </summary>
        public List<Log<T>> Logs
        {
            get { return m_Logs; }
            set { m_Logs = value; }
        }

        private sd.Stopwatch m_internalWatch = new sd.Stopwatch();
        sd.Stopwatch internalWatch
        {
            get { return m_internalWatch; }
            set { m_internalWatch = value; }
        }

        private long m_Elapsed1;
        long elapsed1
        {
            get { return m_Elapsed1; }
            set { m_Elapsed1 = value; }
        }

        private long m_Elapsed2;
        long elapsed2
        {
            get { return m_Elapsed2; }
            set { m_Elapsed2 = value; }
        }

        /// <summary>
        /// Start the stop watch
        /// </summary>
        public void Start()
        {
            internalWatch.Start();
        }

        /// <summary>
        /// stop the stop watch
        /// </summary>
        public void Stop()
        {            
            internalWatch.Stop();            
        }

        /// <summary>
        /// add a message to the log
        /// </summary>
        /// <param name="message"></param>
        public void Log(T message)
        {
            elapsed2 = this.elapsed();
            this.Logs.Add(new Log<T>(message, elapsed2 - elapsed1));
            elapsed1 = elapsed2;
        }
    }

    /// <summary>
    /// generic log object
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class Log<T>
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="message"></param>
        /// <param name="elapsed"></param>
        public Log(T message, long elapsed)
        {
            this.ElapsedTime = elapsed;
            this.Message = message;
        }

        private long m_ElapsedTime;
        /// <summary>
        /// 
        /// </summary>
        public long ElapsedTime
        {
            get { return m_ElapsedTime; }
            set { m_ElapsedTime = value; }
        }

        private T m_Message;
        /// <summary>
        /// 
        /// </summary>
        public T Message
        {
            get { return m_Message; }
            set { m_Message = value; }
        }
    }

    /// <summary>
    /// 
    /// </summary>
    public enum LogType
    {
        /// <summary>
        /// 
        /// </summary>
        Ticks,
        /// <summary>
        /// 
        /// </summary>
        Milliseconds
    }
}
