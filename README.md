Kitten
======

Non-Blocking Cat. Or chat. #north-american-octo-lana

Kitten is actually not using the node.js HTTP or Net API but uses node for it's v8 engine and other capabilities.
The server is using direct system calls and manipulation file descriptors through the syscalls module, developed by Marc Andre Cournoyer for the prupose of its class.

To launch teh server, use :
`node bin/kitten`