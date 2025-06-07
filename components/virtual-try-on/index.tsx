"use client";

import React, { useState } from "react";
import { Camera, Play, Palette, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Mirror } from "./mirror";

const virtualItems = [
  { id: "glasses", name: "Sunglasses", icon: "🕶️", color: "#1a1a1a" },
  { id: "hat", name: "Baseball Cap", icon: "🧢", color: "#2563eb" },
  { id: "mask", name: "Face Mask", icon: "😷", color: "#10b981" },
];

export const VirtualTryOn = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
            <Camera className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Virtual Try-On Studio
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Experience our advanced virtual try-on technology. Test different
          accessories using real-time face detection and AR overlay.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Camera View */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Camera View
                  {/* <Badge variant="default">Face Detected</Badge> */}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsCameraActive(!isCameraActive)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Camera
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative bg-black aspect-video">
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                  {!isCameraActive ? (
                    <div className="text-center space-y-4">
                      <Camera className="h-16 w-16 mx-auto text-muted-foreground" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          Camera Not Active
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Click &quot;Start Camera&quot; to begin the virtual
                          try-on experience
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Mirror />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Controls Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Item Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Virtual Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Item</Label>
                <Select defaultValue="glasses">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {virtualItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        <div className="flex items-center gap-2">
                          <span>{item.icon}</span>
                          <span>{item.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Scale: 1.0x</Label>
                  <Slider
                    defaultValue={[1.0]}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Opacity: 80%</Label>
                  <Slider
                    defaultValue={[0.8]}
                    min={0.1}
                    max={1.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detection Settings */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Detection Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-detection" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Show Detection Box
                </Label>
                <Switch
                  id="show-detection"
                  defaultChecked
                />
              </div>

              <div className="space-y-2 p-3 bg-muted rounded-lg">
                <h4 className="text-sm font-medium">Detection Status</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className="ml-1 font-medium">85%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <span className="ml-1 font-medium">320×240</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                💡 Tips for Better Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Ensure good lighting on your face</li>
                <li>• Face the camera directly</li>
                <li>• Keep your face centered in the frame</li>
                <li>• Avoid shadows and backlighting</li>
                <li>• Stay within arm&apos;s length of the camera</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
