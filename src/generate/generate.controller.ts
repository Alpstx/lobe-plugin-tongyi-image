import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Settings } from 'src/common/setting.dto';
import {
  createErrorResponse,
  getPluginSettingsFromRequest,
  PluginErrorType
} from '@lobehub/chat-plugin-sdk';
import { GenerateReqBody, IImageGenerationResponse, IImageGenerationResult, IImageGenerationStatusResponse } from './generate.type';
import { GenerateService } from './generate.service';

@Controller('generate')
export class GenerateController {

  constructor(private readonly generateService: GenerateService) {}

  @Post()
  async generate(@Req() req: Request, @Body() body: GenerateReqBody) {
    let settings = getPluginSettingsFromRequest<Settings>(req);
    
    if (!settings)
      return createErrorResponse(PluginErrorType.PluginSettingsInvalid, {
        message: 'Plugin settings not found.'
      });

    const apiKey = settings.ALIBABA_API_KEY;

    const { prompt } = body;

    if (!prompt)
      return createErrorResponse(PluginErrorType.BadRequest, {
        message: 'Prompt is required.'
      });

    let result = ''

    const markdownResp = await new Promise((resolve, reject) => {
      this.generateService.generate(apiKey, prompt).subscribe((data: IImageGenerationResponse) => {
        // 请求成功开始检查状态
        if (data.output.task_status === 'PENDING') {
          this.generateService.checkStatus(apiKey, data.output.task_id).then((data: IImageGenerationStatusResponse) => {
          // 解析图片地址
          const results: IImageGenerationResult[] | undefined = data.output.results
          console.log('results:', results);
          const imageUrl = results ? results[0].url : ''

          // 构建 Markdown 格式的响应
          result = `
            图片已成功生成！

            ![Generated Image](${imageUrl})

            *提示词: ${prompt}*
          `.trim()
          resolve(result)
          }).catch((error) => {
            // 发生异常
            console.error('Failed to generate image', error);
            throw createErrorResponse(PluginErrorType.InternalServerError, {
              message: error.message
            })
          })
        }
      })
    })
    return markdownResp
  }
}
