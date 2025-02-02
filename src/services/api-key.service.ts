import { randomBytes } from 'crypto';
import { dataSource } from '../database/datasource';
import { ApiKey, ApiKeyStatus } from '../entities/api-key';

export class ApiKeyService {
  private apiKeyRepository = dataSource.getRepository(ApiKey);

  async generateApiKey(userId: number, expiresInDays: number = 30): Promise<ApiKey> {
    const key = randomBytes(32).toString('hex');
    
    const apiKey = new ApiKey();
    apiKey.key = key;
    apiKey.userId = userId;
    apiKey.expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
    
    return await this.apiKeyRepository.save(apiKey);
  }

  async validateApiKey(key: string): Promise<boolean> {
    const apiKey = await this.apiKeyRepository.findOne({ 
      where: { 
        key,
        status: ApiKeyStatus.ACTIVE
      }
    });

    if (!apiKey) return false;
    if (apiKey.expiresAt < new Date()) {
      apiKey.status = ApiKeyStatus.EXPIRED;
      await this.apiKeyRepository.save(apiKey);
      return false;
    }

    apiKey.usageCount += 1;
    await this.apiKeyRepository.save(apiKey);
    return true;
  }

  async revokeApiKey(key: string): Promise<void> {
    await this.apiKeyRepository.update(
      { key },
      { status: ApiKeyStatus.REVOKED }
    );
  }
}