import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  articleList: any[] = [];
  loading: boolean = false;
  orderTypeList: any[] = [
    {
      id: 1,
      name: '最新发布'
    },
    {
      id: 2,
      name: '最近更新'
    }
  ];
  search: {
    tag: number[],
    type: number,
    name: string,
    order: number
  } = {
    tag: [],
    type: null,
    name: '',
    order: 1
  };
  typeList: any[] = [];
  tagList: any[] = [];

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.loading = true;
    let url = `https://cyx7788414.github.io/blog/index.json`;
    this.http.get(url, {
      // headers: {
      //   'Access-Control-Allow-Origin': '*'
      // }
    }).subscribe({
      next: (result: any) => {
        console.log(result);
        this.loading = false;
        this.typeList = result.types;
        this.tagList = result.tags;
        // this.articleList = result.articles;
        this.articleList = [];
      },
      error: err => {
        console.log(err);
        this.loading = false;
        this.typeList = [];
        this.tagList = [];
        this.articleList = [];
      }
    });
  }

}
