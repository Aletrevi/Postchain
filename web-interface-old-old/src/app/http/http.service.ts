import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';

// DO NOT DELETE THIS: IF DELETED OPTIONAL PARAMETER FOR SERVICE WILL THROW DEP. INJECTION EXCEPTIONS IN AOT
export const USELESS_HTTP_SERVICE_INJECTION_TOKEN = new InjectionToken<string>('4b7e614a-fced-4e5f-a7a8-afb42c3e88e9');

@Injectable({providedIn : 'root'})
export abstract class HttpService<T> {
    constructor(
        protected http: HttpClient,
        @Optional() @Inject(USELESS_HTTP_SERVICE_INJECTION_TOKEN) private contextUrl: string = "",
    ) {
        this.contextUrl = '/api/' + this.contextUrl;
    }

    // tslint:disable-next-line no-shadowed-variable
    protected post<T>(body: T): Observable<T> {
        return this.http.post<T>(this.contextUrl, body);
    }

    // tslint:disable-next-line no-shadowed-variable
    protected get<T>(params: string = ''): Observable<T> {
        const url = this.contextUrl + '/?' + params;
        return this.http.get<T>(url);
    }

    // tslint:disable-next-line no-shadowed-variable
    protected put<T>(params: string): Observable<T> {
        return this.http.put<T>(this.contextUrl, params);
    }

    // tslint:disable-next-line no-shadowed-variable
    protected delete<T>(params: string): Observable<T> {
        const url = this.contextUrl + params;
        return this.http.delete<T>(url);
    }
}
