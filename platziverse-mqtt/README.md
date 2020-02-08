# plaztiverse-mqtt

## `agent-connected`

``` js
{
  agent: {
    uuid, // auto generate
    username, // define by configuration
    name, // define by configuration
    hostname, //obtain it from the OS
    pid // obtain it from the process
  }
}
```

## `agent-disconnected`

``` js
{
  agent: {
    uuid,
  }
}
```

## `agent-message`

``` js
{
  agent,
  metrics: [
    {
      type,
      value
    }
  ],
  timestamp // generate when message created
}
```