import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { APIconstant } from 'src/app/constants/apiConstants';
import { CommonServiceService } from 'src/app/Services/common-service.service';
import { validationMessage } from 'src/app/constants/validationConstants';

@Component({
  selector: 'app-ques-ans',
  templateUrl: './ques-ans.component.html',
  styleUrls: ['./ques-ans.component.css']
})
export class QuesAnsComponent {
  // Component properties
  allData: any[] = [];
  isLoading: boolean = false;
  loadingMessage: string = '';
  showChatInput: boolean = false;
  showSingleQuestion: boolean = false;
  showTemplate: boolean = false;
  responseReceived: boolean = false;
  singleQuestionInput: string = '';
  templateQuestions: any[] = [{ text: '' }];
  pdfId: string = '';
  fileSelected: boolean = false;
  fileError: boolean = false;
  validationMessage = validationMessage;

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiServiceService,
    private commonService: CommonServiceService
  ) { }

  // Handle file upload
  onFileChange(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.handlePdfUpload(file);
    } else {
      this.fileError = true;
      this.fileSelected = false;
    }
  }

  // Process PDF upload
  private handlePdfUpload(file: File) {
    this.fileError = false;
    this.fileSelected = true;
    this.isLoading = true;
    this.loadingMessage = "Processing document...";
    this.spinner.show();

    const formData = new FormData();
    formData.append('file', file);

    this.api.post(APIconstant.uploadPdf, formData).subscribe(
      (res: any) => {
        this.commonService.notification('info', res.message);
        this.pdfId = res.pdf_id;
        this.showChatInput = true;
        this.allData = [];
        this.displayFileContent(file);
        this.isLoading = false;
        this.spinner.hide();
      },
      (err) => {
        console.error(err);
        this.isLoading = false;
        this.spinner.hide();
      }
    );
  }

  // Display PDF content in iframe
  private displayFileContent(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const iframe = document.getElementById('documentViewer') as HTMLIFrameElement;
      if (iframe) {
        iframe.src = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }

  // Show single question input
  showSingleQuestionInput() {
    this.showSingleQuestion = true;
    this.showTemplate = false;
    this.showChatInput = false;
    this.responseReceived = false;
  }

  // Cancel single question input
  cancelSingleQuestion() {
    this.showSingleQuestion = false;
    this.singleQuestionInput = '';
    this.showChatInput = true;
    this.allData = [];
  }

  // Show template questions
  showTemplatePopup() {
    this.showTemplate = true;
    this.showSingleQuestion = false;
    this.showChatInput = false;
    this.responseReceived = false;
  }

  // Send single question to API
  sendSingleQuestion() {
    const question = this.singleQuestionInput;
    this.singleQuestionInput = '';
    this.isLoading = true;
    this.spinner.show();
    this.loadingMessage = "Generating answer...";

    const params = {
      "query": question,
      "pdf_id": this.pdfId
    };

    this.api.post(APIconstant.askSingleQuestion, params).subscribe(
      (res: any) => {
        if (res) {
          this.allData = [{
            question: question,
            page: res.page,
            response: res.response,
            feedbackGiven: false
          }];
          this.showChatInput = false;
          this.responseReceived = true;
        }
        this.isLoading = false;
        this.spinner.hide();
      },
      (err) => {
        console.error(err);
        this.isLoading = false;
        this.spinner.hide();
      }
    );
  }

  // Add new template question
  addTemplateQuestion() {
    this.templateQuestions.push({ text: '' });
  }

  // Remove template question
  removeTemplateQuestion(index: number) {
    this.templateQuestions.splice(index, 1);
  }

  // Cancel template questions
  cancelTemplate() {
    this.templateQuestions = [{ text: '' }];
    this.showTemplate = false;
    this.showChatInput = true;
    this.allData = [];
  }

  // Submit template questions to API
  submitTemplateQuestions() {
    const questions = this.templateQuestions.map(q => q.text);
    this.isLoading = true;
    this.showTemplate = false;
    this.spinner.show();
    this.loadingMessage = "Generating answer...";

    const params = {
      "queries": questions,
      "pdf_id": this.pdfId
    };

    this.api.post(APIconstant.askFromTemplate, params).subscribe(
      (res: any) => {
        this.allData = res.map((response: any, index: number) => ({
          question: questions[index],
          response: response.response,
          page: response.page,
          feedbackGiven: false
        }));
        this.showTemplate = false;
        this.templateQuestions = [{ text: '' }];
        this.showChatInput = false;
        this.responseReceived = true;
        this.isLoading = false;
        this.spinner.hide();
      },
      (err) => {
        console.error(err);
        this.isLoading = false;
        this.spinner.hide();
      }
    );
  }

  // Submit feedback for a question
  submitFeedback(index: number, feedback: string) {
    this.allData[index].feedbackGiven = true;
    const feedbackData = {
      question: this.allData[index].question,
      answer: this.allData[index].response,
      pdf_id: this.pdfId,
      feedback: feedback
    };

    this.isLoading = true;
    this.spinner.show();
    this.loadingMessage = "Submitting feedback...";

    this.api.post(APIconstant.submitFeedback, feedbackData).subscribe(
      (res: any) => {
        this.commonService.notification('success', res.message);
        this.isLoading = false;
        this.spinner.hide();
      },
      (err) => {
        console.error('Error submitting feedback:', err);
        this.isLoading = false;
        this.spinner.hide();
      }
    );
  }

  // Check if all feedback has been given
  private allFeedbackGiven(): boolean {
    return this.allData.every(data => data.feedbackGiven);
  }

  // Return to input screen
  backToInput() {
    if (this.allFeedbackGiven()) {
      this.resetToDefault();
    } else {
      this.commonService.notification('warning', 'Please submit feedback to proceed');
    }
  }

  // Reset component to default state
  private resetToDefault() {
    this.allData = [];
    this.showChatInput = true;
    this.showSingleQuestion = false;
    this.showTemplate = false;
    this.responseReceived = false;
    this.singleQuestionInput = '';
    this.templateQuestions = [{ text: '' }];
  }

  // Handle key press events
  onKeyDown(event: KeyboardEvent, inputType: string, index?: number) {
    if (event.key === 'Enter') {
      if (inputType === 'singleQuestion') {
        this.sendSingleQuestion();
      } else if (inputType === 'templateQuestion' && index === this.templateQuestions.length - 1) {
        this.addTemplateQuestion();
      }
    }
  }
}