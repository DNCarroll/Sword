using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sword.File
{
    public class Watcher
    {

        #region Properties

        private bool m_IsAlive = true;
        bool IsAlive
        {
            get { return m_IsAlive; }
            set { m_IsAlive = value; }
        }

        /// <summary>
        /// The default wait is 2 seconds.
        /// </summary>
        private int m_SecondsToWaitForFileChange = 2;
        public int SecondsToWaitForFileChange
        {
            get { return m_SecondsToWaitForFileChange; }
            set { m_SecondsToWaitForFileChange = value; }
        }

        private ConcurrentBag<FileObject> m_threadSafeList = new ConcurrentBag<FileObject>();
        ConcurrentBag<FileObject> threadSafeList
        {
            get { return m_threadSafeList; }
            set { m_threadSafeList = value; }
        }

        private string m_DirectoryToWatch;
        string directoryToWatch
        {
            get { return m_DirectoryToWatch; }
            set { m_DirectoryToWatch = value; }
        }

        private string m_filter;
        public string filter
        {
            get { return m_filter; }
            set { m_filter = value; }
        }

        private FileSystemWatcher m_watcher;
        FileSystemWatcher watcher
        {
            get { return m_watcher; }
            set { m_watcher = value; }
        }

        #endregion

        /// <summary>
        /// Aborts the File Watcher.  The file watcher will be restarted with Start Method.
        /// </summary>
        public void Abort()
        {
            this.IsAlive = false;
            delayThread.Abort();
            delayThread = null;
        }

        System.Threading.Thread delayThread;
        void delayThreadMethod()
        {
            if (this.FilesChanged != null && threadSafeList.Count > 0)
            {
                var fileEventObjects = new List<string>();
                var now = DateTime.Now;
                var olderItem = threadSafeList.FirstOrDefault(o => now.Subtract(o.AddedToQueue).TotalSeconds > SecondsToWaitForFileChange);
                while (olderItem != null)
                {
                    if (threadSafeList.TryTake(out olderItem))
                    {
                        fileEventObjects.Add(olderItem.Path);
                        olderItem = null;
                    }
                    else
                    {
                        break;
                    }
                    olderItem = threadSafeList.FirstOrDefault(o => now.Subtract(o.AddedToQueue).TotalSeconds > SecondsToWaitForFileChange);
                }
                if (fileEventObjects.Count > 0)
                {
                    this.FilesChanged(fileEventObjects);
                }
            }
            System.Threading.Thread.Sleep(1000);
            if (this.IsAlive)
            {
                delayThreadMethod();
            }
        }

        private Action<List<string>> m_fileChangedEvent;
        public Action<List<string>> FilesChanged
        {
            get { return m_fileChangedEvent; }
            set { m_fileChangedEvent = value; }
        } 
        
        /// <summary>
        /// Start watching a directory for changes
        /// </summary>
        /// <param name="directoryToWatch"></param>
        /// <param name="filesChanged">The action that accepts the files that changed.</param>
        /// <param name="filter"></param>
        public void Start(string directoryToWatch, Action<List<string>> filesChanged,  string fileFilter = "*")
        {
            this.directoryToWatch = directoryToWatch;
            this.filter = fileFilter;
            this.FilesChanged = filesChanged;
            this.initiateWatcher();
        }

        //async await here?
        //wait 10 seconds and then fire it?
        void watcher_Changed(object sender, FileSystemEventArgs e)
        {
            var found = this.threadSafeList.FirstOrDefault(o => o.Path == e.FullPath);
            if (found == null)
            {
                this.threadSafeList.Add(new FileObject { Path = e.FullPath, AddedToQueue = DateTime.Now });
            }
        }

        /// <summary>
        /// If there is any doubt that the file that the directory is being watched.
        /// </summary>
        public void InsureRunning()
        {
            if (this.watcher == null && !string.IsNullOrEmpty(this.directoryToWatch) || this.delayThread == null)
            {
                initiateWatcher();
            }
        }

        void initiateWatcher()
        {
            this.watcher = new FileSystemWatcher(directoryToWatch, filter);
            watcher.NotifyFilter = NotifyFilters.LastWrite;
            this.watcher.Changed += watcher_Changed;
            if (this.delayThread != null)
            {
                delayThread.Abort();
                delayThread = null;
            }
            delayThread = new System.Threading.Thread(delayThreadMethod);
            watcher.EnableRaisingEvents = true;
            this.IsAlive = true;
            delayThread.Start();
        }
    }

    public class FileObject
    {

        private DateTime m_AddedToQueue;
        public DateTime AddedToQueue
        {
            get { return m_AddedToQueue; }
            set { m_AddedToQueue = value; }
        }       

        private string m_Path;
        public string Path
        {
            get { return m_Path; }
            set { m_Path = value; }
        }
                
    }
}
