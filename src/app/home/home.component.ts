import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { TweetService } from '../services/tweet.service';
import { Tweet } from '../models/tweets/Tweet';
import { ReactionService } from '../services/reaction.service';
import { Reaction } from '../models/Reaction/Reaction';
import { ReactionCount } from '../models/Reaction/ReactionCount';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  username: String = '';
  tweetText: String = '';
  tweets: Tweet[] = [];
  reactionCounts: { [tweetId: number]: ReactionCount[] } = {};
  commentTexts: { [tweetId: number]: string } = {};

  constructor(
    private storageService: StorageService,
    private tweetService: TweetService,
    private ReactionService: ReactionService
  ) {
    this.username = this.storageService.getSession('user');
    console.log(this.username);
    this.getTweets();
  }

  reactToTweet(tweetId: number, reactionId: number) {
    const reaction: Reaction = {
      tweetId: tweetId,
      // userId: this.storageService.getSession('userId'),
      reactionId: reactionId,
    };
    this.ReactionService.toggleReaction(reaction).subscribe(
      (response) => {
        console.log('Reaction added successfully:', response);
        this.getTweets();
      },
      (error) => {
        console.error('Error adding reaction:', error);
      }
    );
  }

  private getTweets() {
    this.tweetService.getTweets().subscribe((tweets: any) => {
      this.tweets = tweets;
      console.log(this.tweets);
      this.updateAllReactions(tweets);
    });
  }

  private updateAllReactions(tweets: any[]) {
    tweets.forEach((tweet) => {
      this.ReactionService.getReactionsByTweetId(Number(tweet.id)).subscribe(
        (data) => {
          this.reactionCounts[Number(tweet.id)] = data;
        }
      );

      if (tweet.comments && tweet.comments.length > 0) {
        this.updateAllReactions(tweet.comments);
      }
    });
  }

  public getReactionCount(tweetId: number, reactionId: number): number {
    const reactions = this.reactionCounts[tweetId];
    if (!reactions) return 0;
    const found = reactions.find((rc) => rc.reactionId === reactionId);
    return found ? found.count : 0;
  }

  public addTweet() {
    this.tweetService.postTweet(this.tweetText).subscribe((tweet: any) => {
      console.log(tweet);
      this.getTweets();
    });
  }
  public addComment(parentId: number) {
    const text = this.commentTexts[parentId];
    if (!text) return;

    this.tweetService.postComment(text, parentId).subscribe((tweet: any) => {
      console.log('Comentario añadido:', tweet);
      this.commentTexts[parentId] = ''; 
      this.getTweets(); 
    });
  }

  expandedTweets: Set<number> = new Set();
  toggleThread(tweetId: number): void {
    if (this.expandedTweets.has(tweetId)) {
      this.expandedTweets.delete(tweetId);
    } else {
      this.expandedTweets.add(tweetId);
    }
  }

  activeCommentInputs: Set<number> = new Set();

  toggleCommentInput(tweetId: number): void {
    if (this.activeCommentInputs.has(tweetId)) {
      this.activeCommentInputs.delete(tweetId);
    } else {
      this.activeCommentInputs.add(tweetId);
    }
  }
}
