import {Deferred} from "ts-deferred";
export function deferred<T>(success?:((value: T) => void | PromiseLike<void>) | null ,fails?:((reason: any) => void | PromiseLike<void>) | null ,final?:(() => void) | null){
    const d: Deferred<T> = new Deferred<T>();
    d.promise.then(success).catch(fails).finally(final)
    return d
  }