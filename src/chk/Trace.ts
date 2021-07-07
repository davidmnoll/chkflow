function trace<T>(x:T, msg: string = '',stackTrace: boolean = false): T{
    console.log(msg+'---trace',x);
    if (stackTrace) console.trace(); 
    return x
}
  
function traceBreak<T>(x:T, msg: string = ''): T{
    console.log(msg+'---trace',x);
    throw new Error("trace break");
}
function traceFunc<T>(x:T, fn: Function | null, msg: string = '', doBreak: boolean = false, stackTrace: boolean = false): T{
    console.log(msg+'---trace fn', fn ? fn(x) : 'null function', x, fn);
    if (doBreak) throw new Error("trace func break"); 
    if (stackTrace) console.trace(); 
    return x
}
function traceQuiet<T>(x:T, ...args: any[]): T{
    return x
}

export {
    trace,
    traceQuiet,
    traceBreak,
    traceFunc
}