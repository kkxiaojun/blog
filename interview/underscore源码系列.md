# underscore
## void 0
1. `void expression`均为`undefined`
2. window下的undefined是可以被重写的，于是导致了某些极端情况下使用undefined会出现一定的差错 
3. 防止undefined被重写
4. 非严格模式下，undefined是可以重写的，严格模式则不能重写