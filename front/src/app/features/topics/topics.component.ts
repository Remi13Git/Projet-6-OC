import { Component, OnInit } from '@angular/core';
import { TopicService } from '../../core/services/topic.service';
import { Topic } from '../../core/interfaces/topic.interface';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  topics: Topic[] = [];
  subscribedTopicIds: number[] = [];
  message: string = '';

  constructor(private topicService: TopicService) {}

  ngOnInit(): void {
    this.loadTopics();
    this.loadSubscriptions();
  }

  loadTopics(): void {
    this.topicService.getTopics().subscribe({
      next: (data) => {
        this.topics = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des topics', error);
        this.message = 'Erreur lors du chargement des topics';
      }
    });
  }

  loadSubscriptions(): void {
    this.topicService.getSubscribedTopicIds().subscribe({
      next: (data) => {
        this.subscribedTopicIds = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des abonnements', error);
      }
    });
  }

  onSubscribe(topicId: number): void {
    this.topicService.subscribeToTopic(topicId).subscribe({
      next: (response) => {
        this.message = response.message || 'Abonnement réussi';
        // Recharge la liste des abonnements après l'abonnement
        this.loadSubscriptions();
      },
      error: (error) => {
        console.error('Erreur lors de l\'abonnement', error);
        this.message = error.error ? error.error : 'Erreur lors de l\'abonnement';
      }
    });
  }

  isSubscribed(topicId: number): boolean {
    return this.subscribedTopicIds.includes(topicId);
  }
}
