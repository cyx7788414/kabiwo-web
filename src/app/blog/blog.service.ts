import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  articleList: any[] = [];

  baseUrl: string = `https://cyx7788414.github.io/blog/`;
  cdnBaseUrl: string = `https://cdn.jsdelivr.net/gh/cyx7788414/blog@master/`;
  
  colorList: string[] = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
  lastDataSave: any;
  lastSearch: any;
  lastSearchMobile: any;
  returnListFromDetail: boolean = false;
  tagList: any[] = [];
  tagObj: any = {};
  typeList: any[] = [];
  typeObj: any = {};

  getBlogDataSubject: Subject<any> = new Subject();


  constructor(
    private http: HttpClient,
    private message: NzMessageService
  ) { }

  getBlogData(refresh?: boolean, useBaseUrl?: boolean): Subject<any> {
    if (refresh || !this.lastDataSave) {
      let url = (useBaseUrl?this.baseUrl:this.cdnBaseUrl) + `index.json`;
      this.http.get(url).subscribe({
        next: (result: any) => {
          this.lastDataSave = result;
          this.typeList = result.types;
          this.tagList = result.tags;
          this.articleList = result.articles;
          this.tagObj = {};
          this.tagList.forEach(v => {
            this.tagObj[v.id] = v;
          });
          this.typeObj = {};
          this.typeList.forEach((v, i) => {
            v._color = this.colorList[i % this.colorList.length];
            this.typeObj[v.id] = v;
          });
          this.getBlogDataSubject.next('success');
        },
        error: err => {
          console.log(err);
          if (!useBaseUrl) {
            this.getBlogData(refresh, true);
            return;
          }
          this.getBlogDataSubject.next('error');
          this.message.error('拉取文章列表失败');
        }
      });
    } else {
      window.setTimeout(() => {
        this.getBlogDataSubject.next('success');
      });
    }
    return this.getBlogDataSubject;
  }

  getBlogDetail(article: any, useBaseUrl?: boolean): Observable<any> {
    let url = (useBaseUrl?this.baseUrl:this.cdnBaseUrl) + article.path.split('./')[1] + `/article.md?t=${(article.update / 1000).toFixed()}`;
    return this.http.get(url, {
      responseType: 'text'
    });
  }
}
