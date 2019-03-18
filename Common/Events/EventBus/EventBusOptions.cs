﻿using System;
using System.Collections.Generic;
using System.Text;

namespace DatabasesUniversity.Common.Events.EventBus
{
    public class EventBusOptions
    {
        public string HostName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public int RetryCount { get; set; } = 5;
        public string QueueName { get; set; }
    }
}
