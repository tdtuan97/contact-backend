import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { FastifyRequest } from 'fastify';
import { customAlphabet, nanoid } from 'nanoid';
import * as CryptoJS from 'crypto-js';
import * as bcrypt from 'bcrypt';
import QRCode from 'qrcode';
import path from 'path';
import * as console from 'console';

@Injectable()
export class UtilService {
    constructor(private readonly httpService: HttpService) {}

    /**
     * Get request IP
     */
    getReqIP(req: FastifyRequest): string {
        return (
            // Determine whether there is a reverse proxy IP
            (
                (req.headers['x-forwarded-for'] as string) ||
                // Determine the IP of the backend socket
                req.socket.remoteAddress
            ).replace('::ffff:', '')
        );
    }

    /* Determine whether the IP is an intranet */
    IsLAN(ip: string) {
        ip.toLowerCase();
        if (ip == 'localhost') return true;
        let a_ip = 0;
        if (ip == '') return false;
        const aNum = ip.split('.');
        if (aNum.length != 4) return false;
        a_ip += parseInt(aNum[0]) << 24;
        a_ip += parseInt(aNum[1]) << 16;
        a_ip += parseInt(aNum[2]) << 8;
        a_ip += parseInt(aNum[3]) << 0;
        a_ip = (a_ip >> 16) & 0xffff;
        return (
            a_ip >> 8 == 0x7f ||
            a_ip >> 8 == 0xa ||
            a_ip == 0xc0a8 ||
            (a_ip >= 0xac10 && a_ip <= 0xac1f)
        );
    }

    /* get location by ip */
    async getLocation(ip: string) {
        if (this.IsLAN(ip)) return 'Intranet IP';
        let { data } = await this.httpService.axiosRef.get(
            `https://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`,
            { responseType: 'arraybuffer' },
        );
        data = new TextDecoder('gbk').decode(data);
        data = JSON.parse(data);
        return data.addr.trim().split(' ').at(0);
    }

    /**
     * AES encryption
     */
    public aesEncrypt(msg: string, secret: string): string {
        return CryptoJS.AES.encrypt(msg, secret).toString();
    }

    /**
     * AES decryption
     */
    public aesDecrypt(encrypted: string, secret: string): string {
        return CryptoJS.AES.decrypt(encrypted, secret).toString(
            CryptoJS.enc.Utf8,
        );
    }

    /**
     * md5 encryption
     */
    public md5(msg: string): string {
        return CryptoJS.MD5(msg).toString();
    }

    /**
     * Generate a UUID
     */
    public generateUUID(): string {
        return nanoid();
    }

    /**
     * Storage path
     */
    public getStoragePath() {
        return path.join(__dirname, '/public/');
    }

    /**
     * Generate a random value
     */
    public generateRandomValue(
        length: number,
        placeholder = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
    ): string {
        const customNanoid = customAlphabet(placeholder, length);
        return customNanoid();
    }

    /**
     * Hash string
     */
    public bcryptHash(string) {
        let salt = '';
        let hash = '';
        try {
            salt = bcrypt.genSaltSync(10);
            hash = bcrypt.hashSync(string, salt);
        } catch (e) {
            Logger.error('Error hash string string', e);
        }
        return {
            salt,
            hash,
        };
    }

    /**
     * Compare string
     */
    public bcryptCompare(string, hash) {
        let result = false;
        try {
            result = bcrypt.compareSync(string, hash);
        } catch (e) {
            Logger.error('Error compare string', e);
        }

        return result;
    }

    /**
     * Format date
     * @param date
     * @param separator
     */
    public formatDate(date = null, separator = '-') {
        let d = date ? new Date(date) : new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join(separator);
    }

    /**
     * Generate Steve Tag by Username
     * @param username
     */
    public generateSteveTagByUsername(username: string) {
        return username + '-tag';
    }

    /**
     * Create QR Code
     * @param text
     */
    public async createQrCode(text) {
        let result = null;
        try {
            result = await QRCode.toDataURL(text);
        } catch (e) {
            Logger.error('Fail to create QR Code', e);
        }

        return result;
    }

    /**
     * Create QR Code
     * @param filename
     * @param text
     */
    public async createQrCodeToFile(filename, text) {
        let result = null;
        try {
            result = await QRCode.toDataURL(filename, text, {
                errorCorrectionLevel: 'H',
                type: 'jpg',
            });
        } catch (e) {
            Logger.error('Fail to create QR Code', e);
        }
        return result;
    }
}
