import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlogService } from '../blog.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap, Router, RouterEvent, NavigationStart} from '@angular/router';
import * as marked from 'marked';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {

  article: any;
  articleList: any[] = [];
  blogDetailHtml: string = '';
  loading: boolean = false;
  tagObj: any = {};
  typeObj: any = {};

  private articleId: string;
  private subscription: Subscription[] = [];

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.subscription.push(this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        if (event.url === '/blog') {
          this.blogService.returnListFromDetail = true;
        } else {
          this.blogService.returnListFromDetail = true;
          this.blogService.lastSearch = undefined;
          this.blogService.lastSearchMobile = undefined;
        }
      }
    }));
    this.loading = true;
    this.subscription.push(this.route.paramMap.subscribe((param: ParamMap) => {
      this.articleId = param.get('id');
      this.getArticle();
    }));
    this.subscription.push(this.blogService.getBlogData().subscribe(response => {
      this.articleList = this.blogService.articleList;
      this.tagObj = this.blogService.tagObj;
      this.typeObj = this.blogService.typeObj;
      this.getArticle();
    }));    
  }

  ngOnDestroy() {
    this.subscription.forEach(v => {
      v.unsubscribe();
    });
  }

  private getArticle(): void {
    if (!this.articleId || this.articleList.length === 0) {
      return;
    }
    this.article = this.articleList.find(v => v.id + '' === this.articleId);
    this.blogService.getBlogDetail(this.article).subscribe({
      next: response => {
        this.loading = false;
        this.blogDetailHtml = marked(response.replace(/\]\(\.\//g, v => {
          return `](${this.blogService.baseUrl}${this.article.path.split('./')[1]}/`;
        }));
      },
      error: err => {
        console.log(err)
        this.loading = false;
        this.message.error('拉取文章详情失败');
      }
    });
  }
}
