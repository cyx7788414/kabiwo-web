import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlogService } from './blog.service';
import { Subscription } from 'rxjs';
import { Router, NavigationStart, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, OnDestroy {

  articleList: any[] = [];
  loading: boolean = false;
  orderTypeList: any[] = [
    {
      value: 1,
      label: '最新发布'
    },
    {
      value: 2,
      label: '最近更新'
    }
  ];
  search: {
    tag: number[],
    type: number,
    name: string,
    order: number,
    range: any[]
  } = {
    tag: [],
    type: null,
    name: '',
    order: 1,
    range: []
  };
  searchMobile: {
    order: any[],
    type: any[]
  } = {
    order: [{label: '最新发布', value: 1}],
    type: [{label: '选择', value: -1}]
  };
  tagList: any[] = [];
  tagObj: any = {};
  typeList: any[] = [];
  typeListMobile: any[] = [];
  typeObj: any = {};

  private subscription: Subscription[] = [];

  constructor(
    private blogService: BlogService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscription.push(this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        if (event.url.startsWith('/blog/detail/')) {
          this.blogService.lastSearch = this.search;
          this.blogService.lastSearchMobile = this.searchMobile;
        } else {
          this.blogService.lastSearch = undefined;
          this.blogService.lastSearchMobile = undefined;
        }
      }
    }));
    if (this.blogService.returnListFromDetail) {
      this.blogService.returnListFromDetail = false;
      if (this.blogService.lastSearch) {
        this.search = this.blogService.lastSearch;
      }
      if (this.blogService.lastSearchMobile) {
        this.searchMobile = this.blogService.lastSearchMobile;
      }
    }
    this.loading = true;
    this.subscription.push(this.blogService.getBlogData().subscribe(response => {
        this.loading = false;
        this.tagList = this.blogService.tagList;
        this.tagObj = this.blogService.tagObj;
        this.typeList = this.blogService.typeList;
        this.typeObj = this.blogService.typeObj;
        this.articleList = this.blogService.articleList;

        this.typeListMobile = this.typeList.map(v => {
          return {label: v.name, value: v.id};
        });
        this.typeListMobile.unshift({label: '选择', value: -1});
    }));
  }

  ngOnDestroy() {
    this.subscription.forEach(v => {
      v.unsubscribe();
    });
  }

  getArticleList(): any[] {
    let index = this.search.order === 1?'create':'update';
    return this.articleList.filter(v => {
      if (v.status !== 1) {
        return false;
      }
      if (this.search.type || this.search.type === 0) {
        if (v.type !== this.search.type) {
          return false;
        }
      }
      for (let i = 0; i < this.search.tag.length; i++) {
        if (!v.tag.includes(this.search.tag[i])) {
          return false;
        }
      }
      if (this.search.name) {
        if (!v.name.includes(this.search.name)) {
          return false;
        }
      }
      if (this.search.range.length > 0) {
        let target = v[index];
        let range = this.search.range.map((v: Date) => v.getTime());
        if (target < range[0] || target > range[1]) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      return b[index] - a[index];
    });
  }

  mobileSearchChange(): void {
    this.search.order = this.searchMobile.order[0].value;
    this.search.type = this.searchMobile.type[0].value === -1?null:this.searchMobile.type[0].value;
  }
}
