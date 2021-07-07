import { 
    trace,
    traceBreak,
    traceFunc,
    traceQuiet
} from "./Trace"

/** Extras */

class Nothing{
    constructor(msg:string|undefined= undefined){
        this.err = new Error(msg);
    }
    err: Error;
    msg: string = '';
    empty: true = true;
    nothing_messages: string[] = [];
    just_messages: string[] = [];
    newNothing<S>(x:S):Nothing{return new Nothing().addJustMessages(this.just_messages)}
    newJust<S>(x:S):Just<S>{return new Just<S>(x).addJustMessages(this.just_messages)}
    addJustMessages(x:string[]):Nothing{this.just_messages = x; return this}
    addNothingMessages(x:string[]):Nothing{this.nothing_messages = x; return this}
    addMessage(x:string):Nothing{this.nothing_messages.push(x); return this}
    showMessages():Nothing{console.log('showing messages', this.msg,this.nothing_messages, this.just_messages); return this;}
    handle<S>(fn: (x: any) => S): Maybe<S>{ 
        return this.addMessage("");
    };
    handleMaybe<S>(fn: (x: any) => Maybe<S> , debug : boolean = false): Nothing { 
        if(debug) this.throw();
        return this; 
    };
    ifJust<R, S extends Maybe<R>>(x: S){ return this; }
    handleIfJust<R, Q, S extends Maybe<R>, U extends Maybe<Q>>(x: S, fn: (y:Q, z:S) => U ){ return this }
    handleTrace<S, T>(fn: (x: T) => S, msg : string = '', doThrow : boolean = false): Nothing{ 
        console.log(msg+'---handleTrace - Nothing',fn, this)
        if(doThrow){
            this.throw()
        }
        return this; 
    };
    else<T>(fn: ()=>Maybe<T>):Maybe<T>{return fn()};
    trace(){
        return this;
    }
    if(x:boolean | null){return this;}
    dump(debug: boolean = false): null { if (debug){ console.error("dumping nothing", this.err, this.msg); console.trace();}else{/*console.log('dumping nothing',this)*/} return null };
    throw(msg: string | null = null):Nothing { console.log(msg || "maybe thrown", this, this.nothing_messages); throw this.err; return this };
}


class Just<T> {
    constructor(content: T){
        this.content = content;
    }
    content: T;
    empty: false = false;
    maybe_chain: any[] = [];
    just_messages: string[] = [];
    nothing_messages: string[] = [];
    newNothing<S>(x:S):Nothing{return new Nothing().addJustMessages(this.just_messages)}
    newJust<S>(x:S):Just<S>{return new Just<S>(x).addJustMessages(this.just_messages)}
    showMessages():Just<T>{console.log('showing messages', this.just_messages); return this;}
    addJustMessages(x:string[]):Just<T>{this.just_messages = x; return this}
    addNothingMessages(x:string[]):Just<T>{this.nothing_messages = x; return this}
    addMessage(x:string): Just<T>{this.just_messages.push(x);return this}
    else(fn: ()=>Maybe<T>):Maybe<T>{return this};
    handle<S>(fn: (x: T) => S ): Just<S> {
        return new Just<S>(fn(this.content))
    };
    if(x:boolean | null){ return x ? this : new Nothing("boolean test failed");}
    ifJust<R, S extends Maybe<R>>(x: S){ return x.empty ? new Nothing("ifJust was empty") : this; }
    handleIfJust<Q, R, S extends Maybe<R>, U extends Maybe<Q>>(x: S, fn: (y:T, z:S) => U ){ return !x.empty ?  fn(this.content, x) : x }
    handleMaybe<S>(fn: (x: T) => Maybe<S> , debug : boolean = false): Maybe<S> {
        const maybeVal: Maybe<S> = traceQuiet(fn(traceQuiet(this.content, 'this content')), "after fn")
        // console.log('handleMaybe', this.content, this, fn)
        if (maybeVal.empty){
            if(debug) maybeVal.throw();
            return new Nothing("function returned empty maybe")
        }else{
            let val: S = traceQuiet(maybeVal.content, "maybeval content")
            return new Just<S>(val)
        }
    };
    trace(){
        this.maybe_chain.forEach((x, i )=>console.log('maybe '+i+':',x)); return this;
    }
    handleTrace<S>(fn: (x: T) => S, msg : string = '', doThrow : boolean = false): Maybe<S>{ 
        console.log(msg+'---handleTrace - Just', this.content, this)
        console.log("function",fn,  this)
        if(doThrow){
            this.throw()
        }
        return new Just<S>(fn(this.content))
    };
    dump(debug: boolean=false): T | null { if (debug){console.log('dump just', this); }else{ /* console.log('dump just',this) */ } return this.content };
    throw():Just<T> { return this };
}

function isMaybeIf<T>(content: T, test: boolean): Maybe<T> {
    return test ? new Just<T>(content) : new Nothing("isMaybeIf - not");
}


type Maybe<T> = Just<T> | Nothing;

export {
    isMaybeIf,
    Just,
    Nothing    
}
export type { Maybe }
