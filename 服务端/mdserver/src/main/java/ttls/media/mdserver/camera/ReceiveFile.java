/**
 * from to liutao on 2019/9/10
 */
package ttls.media.mdserver.camera;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

/**
 * 接收前端上传文件
 */

@Controller
public class ReceiveFile {

    @RequestMapping("/")
    public String index() {
        return "upload";
    }

    @CrossOrigin
    @RequestMapping(value = "/multiImport", method = RequestMethod.POST)
    @ResponseBody
    public String multiImport(@RequestParam("uploadFile") MultipartFile[] uploadFile) {

        System.out.println(uploadFile.length);
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd_HH_mm_ss_");
        String currentdata = df.format(new Date()) + UUID.randomUUID().toString().substring(0, 6);

        try {
            for (MultipartFile multipartFile : uploadFile) {
                InputStream is = multipartFile.getInputStream();
                String filename = "";
                if(multipartFile.getOriginalFilename().lastIndexOf("\\") > 0){
                    filename = multipartFile.getOriginalFilename().substring(multipartFile.getOriginalFilename().lastIndexOf("\\")+1);
                }else if(multipartFile.getOriginalFilename().lastIndexOf("/") > 0){
                    filename = multipartFile.getOriginalFilename().substring(multipartFile.getOriginalFilename().lastIndexOf("/")+1);
                }else{
                    filename = multipartFile.getOriginalFilename();
                }
                String rename = currentdata + filename;
                //保存文件
                savePic(is, rename);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "message";
    }

    //保存文件
    private void savePic(InputStream inputStream, String fileName) {

        OutputStream os = null;
        try {
            String path = "D:/web/file";
            // 2、保存到临时文件
            // 1K的数据缓冲
            byte[] bs = new byte[1024];
            // 读取到的数据长度
            int len;
            // 输出的文件流保存到本地文件

            File tempFile = new File(path);
            if (!tempFile.exists()) {
                tempFile.mkdirs();
            }
            os = new FileOutputStream(tempFile.getPath() + File.separator + fileName);
            // 开始读取
            while ((len = inputStream.read(bs)) != -1) {
                os.write(bs, 0, len);
            }

        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 完毕，关闭所有连接
            try {
                os.close();
                inputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
