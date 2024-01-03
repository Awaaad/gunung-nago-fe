import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-warming',
  templateUrl: './warming.component.html',
  styleUrls: ['./warming.component.scss'],
})
export class WarmingComponent implements OnInit {
  message!: string;
  message2!: string;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.message = this.navParams.data['message'];
    this.message2 = this.navParams.data['message2'];
  }

  // close modal
  closeModal() {
    this.modalController.dismiss(false);
  }

  onSubmit() {
    this.modalController.dismiss(true);
  }

}
