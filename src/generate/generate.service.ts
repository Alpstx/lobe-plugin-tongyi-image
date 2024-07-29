import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import { IImageGenerationResponse, IImageGenerationResult, IImageGenerationStatusResponse } from './generate.type';
import { response } from 'express';

@Injectable()
export class GenerateService {
  BASE_URL: string;

  constructor(private readonly httpService: HttpService, 
    private readonly configService: ConfigService) {
      this.BASE_URL = this.configService.get('BASE_URL');      
    }

  /**
   * 文生图片
   * @param apiKey 灵积API Key
   * @param prompt 文生图片文本
   * @returns 
   */
  generate(apiKey: string, prompt: string) {
    // 调用阿里云的API生成图片
    console.log('BASE_URL:', this.BASE_URL)
    
    return this.httpService.post(
      `${this.BASE_URL}/services/aigc/text2image/image-synthesis`,
      {
        model: 'wanx-v1',
        input: {
          prompt: prompt
        },
        parameters: {
          n: 1
        }
      },
      {
        headers: {
          'X-DashScope-Async': 'enable',
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    ).pipe(map((response) => {
      console.log('in generate response:', response);
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error('Failed to generate image');
      }
    }))
  }

  /**
   * 检查图片生成任务状态
   * @param apiKey 灵积API Key
   * @param taskId 文生图片任务ID
   * @returns 
   */
  async checkStatus(apiKey: string, taskId: string): Promise<IImageGenerationStatusResponse> {
    let result
    while (true) {
      this.getStatus(apiKey, taskId).subscribe((data: IImageGenerationStatusResponse) => {
        console.log('in checkStatus:', data);
        if (data.output.task_status === 'SUCCEEDED') {
          result = data
          return
        } else if (data.output.task_status === 'FAILED') {
          throw new Error('Failed to generate image');
        }
      })
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (result?.output?.task_status === 'SUCCEEDED') {
        return result
      }
    }
  }

  getStatus(apiKey: string, taskId: string) {
    return this.httpService.get<IImageGenerationStatusResponse>(
      `${this.BASE_URL}/tasks/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      }
    ).pipe(map((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error('Failed to get image generation status');
      }
    }))
  }

}
