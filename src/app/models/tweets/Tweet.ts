export class Tweet {
  id: number = 0;
  tweet: String = '';
  user: string = '';
  postedBy: { username: string } = { username: 'anon' };
  comments: { user: string; tweet: string }[] = [];
}
