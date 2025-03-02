import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHandlerFn, HttpInterceptorFn } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

// Class-based interceptor (legacy approach)
export class LoggingInterceptor implements HttpInterceptor {
   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("LoggingInterceptor", req);
    
        return next.handle(req).pipe(
            tap((event) => console.log("LoggingInterceptor", event))
        );
    }
}

// Function-based interceptor (new approach for standalone applications)
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  console.log("LoggingInterceptor (Function)", req);
  
  return next(req).pipe(
    tap((event) => console.log("LoggingInterceptor (Function)", event))
  );
};