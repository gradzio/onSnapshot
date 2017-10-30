import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'home',
  template: `
    <div class="ons-lc">
      <nav class="ons-nb">
        <div class="ons-hi">
          <a routerLink="/">
            <img height="64" width="64" alt="onSnapshot Logo" src="assets/images/onSnapshot_logo.png"/>
          </a>
        </div>

        <ul class="ons-nl">
          <li>
            <a href="/?sort=hot">HOT</a>
          </li>
          <li>
            <a href="/?sort=fresh">FRESH</a>
          </li>
        </ul>
      </nav>
      
      <section class="ons-sl" *ngIf="articles$ | async; let articles; else loading">
        <article *ngFor="let article of articles; let idx = index">
          <div class="ons-sr">
            <h2>{{ idx+1 }}</h2>
          </div>
          <div class="ons-sd">
            <h4>
              <a [routerLink]="['articles', article.id]">{{ article.doc.get('title') }}</a>
            </h4>
            <div class="ons-sm">
              <span *ngIf="article.author | async; let author; else loadingAuthor">
                <a [routerLink]="['authors', author.id]">{{ author.get('name') }}</a>
              </span>
              <ng-template #loadingAuthor>Loading author...</ng-template>
              <span class="article-date">
                | {{ article.doc.get('publishedAt') | date: 'short' }}
              </span>
            </div>
          </div>
        </article>
      </section>
      <ng-template class="loading-template" #loading>
        <div class="cssload-thecube">
          <div class="cssload-cube cssload-c1"></div>
          <div class="cssload-cube cssload-c2"></div>
          <div class="cssload-cube cssload-c4"></div>
          <div class="cssload-cube cssload-c3"></div>
        </div>
      </ng-template>
    </div>
  `
})
export class HomeComponent implements OnInit {
  public date: Date;
  public catchphrase: string;
  public articles$: Observable<any[]>;

  constructor(db: AngularFirestore) {
    this.articles$ = db.collection('articles', ref => ref.orderBy('publishedAt', 'desc'))
      .snapshotChanges().map(articles =>
        articles.map(article => {
          const id = article.payload.doc.id;
          const author = db.doc(article.payload.doc.get('author').path).snapshotChanges().map(author => author.payload);
          return {id, author, doc: article.payload.doc};
        })
      );
  }

  ngOnInit() {
    this.date = new Date();
    this.catchphrase = 'Developers, developers, developers!'; // TODO randomize
  }
}