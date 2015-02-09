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

        private ConcurrentBag<FileObject> m_threadSafeList = new ConcurrentBag<FileObject>();
        public ConcurrentBag<FileObject> threadSafeList
        {
            get { return m_threadSafeList; }
            set { m_threadSafeList = value; }
        }

        public event EventHandler<List<FileObject>> Changed;

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

        public void Start(string directoryToWatch, string filter = "*")
        {
            this.directoryToWatch = directoryToWatch;
            this.filter = filter;
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
            else if (Changed != null)
            {
                var fileEventObjects = new List<FileObject>();
                var now = DateTime.Now;
                var olderItem = threadSafeList.FirstOrDefault(o => now.Subtract(o.AddedToQueue).TotalSeconds > 10);
                while (olderItem != null)
                {                    
                    if (threadSafeList.TryTake(out olderItem))
                    {
                        fileEventObjects.Add(new FileObject { AddedToQueue = olderItem.AddedToQueue, Path = olderItem.Path });
                        olderItem = null;
                    }
                    else
                    {
                        break;
                    }
                    olderItem = threadSafeList.FirstOrDefault(o => now.Subtract(o.AddedToQueue).TotalSeconds > 10);
                }
                this.Changed(this, fileEventObjects);
            }
        }

        public void InsureRunning()
        {
            if (this.watcher == null && !string.IsNullOrEmpty(this.directoryToWatch))
            {
                initiateWatcher();
            }
        }

        void initiateWatcher()
        {
            this.watcher = new FileSystemWatcher(directoryToWatch, filter);
            watcher.NotifyFilter = NotifyFilters.LastWrite;
            this.watcher.Changed += watcher_Changed;
            watcher.EnableRaisingEvents = true;
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
