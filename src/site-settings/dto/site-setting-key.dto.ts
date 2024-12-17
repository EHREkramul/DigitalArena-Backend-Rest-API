import { IsEnum, IsNotEmpty } from 'class-validator';
import { SiteSettingKey } from 'src/auth/enums/site-setting-key.enum';

export class SiteSettingKeyDto {
  @IsNotEmpty()
  @IsEnum(SiteSettingKey)
  key: SiteSettingKey;
}
